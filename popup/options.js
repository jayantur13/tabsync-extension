document.addEventListener("DOMContentLoaded", async () => {
  const { serverPort = 3210 } = await chrome.storage.local.get("serverPort");
  const portInput = document.getElementById("portInput");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  portInput.value = serverPort;

  saveBtn.addEventListener("click", async () => {
    const port = parseInt(portInput.value);
    if (!port) return alert("Enter a valid port number!");

    await chrome.storage.local.set({ serverPort: port });
    status.textContent = `Extension will try to connect if server is running`;
    alert(`Successfully saved port (${port})!`);
    setTimeout(() => (status.textContent = ""), 3000);

    // Tell background to reconnect
    chrome.runtime.sendMessage({ action: "reconnect" });
  });
});
