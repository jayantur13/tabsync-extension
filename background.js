let ws;
let DEVICE_ID = "Desktop";

(async () => {
  try {
    const res = await fetch("http://localhost:3210/ip");
    const { ip, wsPort } = await res.json();
    const SERVER = `ws://${ip}:${wsPort}`;
    ws = new WebSocket(SERVER);
    console.log("Auto-connected to:", SERVER);

    ws.onopen = () => {
      sendTabs();
      setInterval(sendTabs, 60000);
    };

    ws.onmessage = e => console.log("Message:", e.data);

    chrome.tabs.onUpdated.addListener(sendTabs);
    chrome.tabs.onRemoved.addListener(sendTabs);
    chrome.tabs.onCreated.addListener(sendTabs);

  } catch (err) {
    console.error("TabSync Local: could not find server", err);
  }
})();

function sendTabs() {
  chrome.tabs.query({}, tabs => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          deviceId: DEVICE_ID,
          tabs: tabs.map(t => ({ title: t.title, url: t.url })),
        })
      );
    }
  });
}
