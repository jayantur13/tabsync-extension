let ws;
let DEVICE_ID = "Desktop";
let retryTimeout = 5000; // 5s retry
let isConnecting = false;

init();

async function init() {
  const { serverPort = 3210 } = await chrome.storage.local.get("serverPort");
  tryConnect(serverPort);
}

async function tryConnect(port) {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const res = await fetch(`http://localhost:${port}/ip`, { cache: "no-store" });
    const { ip, wsPort } = await res.json();
    const SERVER = `ws://${ip}:${wsPort}`;
    console.log("Auto-connecting to:", SERVER);

    ws = new WebSocket(SERVER);

    ws.onopen = () => {
      console.log("✅ Connected to TabSync server");
      sendTabs();
      setInterval(sendTabs, 60000);
      chrome.tabs.onUpdated.addListener(sendTabs);
      chrome.tabs.onRemoved.addListener(sendTabs);
      chrome.tabs.onCreated.addListener(sendTabs);
      isConnecting = false;
    };

    ws.onclose = () => {
      console.warn("❌ Disconnected from TabSync server. Retrying...");
      setTimeout(() => tryConnect(port), retryTimeout);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };

    ws.onmessage = (e) => console.log("Message:", e.data);
  } catch (err) {
    console.log(`TabSync Local: could not find server on port ${port}`, err);
    setTimeout(() => {
      isConnecting = false;
      tryConnect(port);
    }, retryTimeout);
  }
}

function sendTabs() {
  chrome.tabs.query({}, (tabs) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          deviceId: DEVICE_ID,
          tabs: tabs.map((t) => ({ title: t.title, url: t.url })),
        })
      );
    }
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "reconnect") {
    if (ws) ws.close();
    init(); // will read new port and reconnect
  }
});
