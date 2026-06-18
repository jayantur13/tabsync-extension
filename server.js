// server.js
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import os from "os";
import qrcode from "qrcode-terminal";
import fetch from "node-fetch";
import http from "http";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3210; // Static port discovery
let WSPORT;
const devices = {}; // { deviceId: { tabs: [], lastSeen: number } }
const CLEANUP_INTERVAL = 60 * 1000; // every minute
const DEVICE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/** --- Utility: Get local IP --- **/
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}

/** --- Utility: Fetch title from URL --- **/
async function fetchTitle(url) {
  try {
    const res = await fetch(url, { timeout: 5000 });
    const text = await res.text();
    const match = text.match(/<title>(.*?)<\/title>/i);
    return match ? match[1].trim() : url;
  } catch {
    return url;
  }
}

/** --- Utility: Simplify devices object --- **/
function simplify(devices) {
  const result = {};
  for (const [id, data] of Object.entries(devices)) {
    result[id] = data.tabs;
  }
  return result;
}

/** --- WebSocket Setup --- **/
const wsServer = http.createServer();
let wss;
wsServer.listen(0, () => {
  const ip = getLocalIP();
  WSPORT = wsServer.address().port;
  wss = new WebSocketServer({ server: wsServer });

  wss.on("connection", (ws) => {
    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const { deviceId, tabs } = data;

        ws.deviceId = deviceId;

        if (!ws.deviceId || !Array.isArray(tabs)) return;

        if (tabs.length === 0) {
          delete devices[ws.deviceId];
          broadcast();
          return;
        }

        // Deduplicate tabs by URL
        const seen = new Set();
        const processedTabs = [];

        for (const tab of tabs) {
          if (!tab.url || seen.has(tab.url)) continue;
          seen.add(tab.url);

          const title =
            !tab.title || tab.title === tab.url
              ? await fetchTitle(tab.url)
              : tab.title;

          processedTabs.push({ title, url: tab.url });
        }

        devices[ws.deviceId] = {
          tabs: processedTabs,
          lastSeen: Date.now(),
        };

        broadcast();
      } catch (err) {
        console.error("[Ext] WS parse error:", err.message);
      }
    });

    ws.on("close", () => {
      if (ws.deviceId) {
        console.log("Device disconnected:", ws.deviceId);
        delete devices[ws.deviceId];
        broadcast();
      } else {
        console.log("Viewer disconnected");
      }
    });

    ws.send(JSON.stringify(simplify(devices)));
  });
});

/** --- Broadcast to all connected clients --- **/
function broadcast() {
  const payload = JSON.stringify(simplify(devices));
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(payload);
  });
}

/** --- Clean inactive devices --- **/
setInterval(() => {
  const now = Date.now();
  let removed = 0;
  for (const [id, device] of Object.entries(devices)) {
    if (now - device.lastSeen > DEVICE_TIMEOUT) {
      delete devices[id];
      removed++;
    }
  }
  if (removed > 0) {
    console.log(`[Ext] 🧹 Cleaned up ${removed} inactive device(s).`);
    broadcast();
  }
}, CLEANUP_INTERVAL);

/** --- REST API --- **/

// Serve frontend files
app.use(express.static("public"));

// List connected devices
app.get("/devices", (req, res) => res.json(simplify(devices)));

// Add a new URL to a device (desktop, mobile, etc.)
app.post("/add", async (req, res) => {
  try {
    const { deviceId, url } = req.body;
    if (!deviceId || !url)
      return res.status(400).json({ error: "Missing fields" });

    const title = await fetchTitle(url);

    if (!devices[deviceId]) {
      devices[deviceId] = { tabs: [], lastSeen: Date.now() };
    }

    // Prevent duplicate URLs
    const exists = devices[deviceId].tabs.some((t) => t.url === url);
    if (!exists) {
      devices[deviceId].tabs.push({ title, url });
      devices[deviceId].lastSeen = Date.now();
      broadcast();
    }

    res.json({ success: true, title });
  } catch (err) {
    console.error("Error adding URL:", err.message);
    res.status(500).json({ error: "Failed to add URL" });
  }
});

// Get local IP + WS port
app.get("/ip", (req, res) => {
  res.json({ ip: getLocalIP(), wsPort: WSPORT });
});

/** --- Startup --- **/
app.listen(PORT, () => {
  const ip = getLocalIP();
  const url = `http://${ip}:${PORT}`;
  console.log("=== EXTENSION SERVER ===");
  console.log(`\n[Ext] 🧩 TabSync Local running at: ${url}`);
  console.log(`[Ext] 🌐 WebSocket listening on ws://${ip}:${WSPORT}`);
  qrcode.generate(url, { small: true });
  console.log("[Ext] 📱 Scan the QR to connect your mobile.\n");
});
