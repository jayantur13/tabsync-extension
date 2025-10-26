# TabSync – Local Browser Sync (Extension)

**TabSync Extension** automatically shares your open browser tabs with the local **TabSync CLI** server — no internet, no cloud, just your Wi-Fi.  
It’s the companion extension for the [`tabsync-cli`](https://www.npmjs.com/package/tabsync-cli) CLI/[`source`](https://github.com/jayantur13/tabsync-cli).

---

## What It Does

- Detects all open tabs in your browser.
- Connects automatically to your **local TabSync server** (`http://localhost:3210`).
- Syncs tab titles and URLs in real time over WebSocket.
- Updates instantly when you:
  - Open a new tab
  - Close a tab
  - Switch or reload a tab

On your desktop or mobile browser, you’ll see all connected devices and their open tabs live — no refresh needed.

---

## How It Works

The extension runs a lightweight background script:

```js
const SERVER = `ws://<your-local-ip>:<wsPort>`;
ws = new WebSocket(SERVER);

ws.onopen = () => {
  sendTabs();
  setInterval(sendTabs, 60000);
};

chrome.tabs.onUpdated.addListener(sendTabs);
chrome.tabs.onRemoved.addListener(sendTabs);
chrome.tabs.onCreated.addListener(sendTabs);
```

## Requirements

- You must have the TabSync Local server running:

```bash
npm install -g tabsync-cli
```

Once started, it’ll show a local URL (e.g. http://192.168.x.x:3210) and a QR code to open on other devices.

- The extension connects automatically to that local server via http://localhost:3210/ip.

## Installation

- Clone or download this repository.
- Open Chrome → Extensions → Manage Extensions.
- Turn on Developer Mode (top right).
- Click Load unpacked and select the folder containing:
- Start your tabsync server from the terminal.
- Watch your desktop tabs appear instantly in the TabSync dashboard.
  > Else use [`releases`](https://github.com/jayantur13/tabsync-extension/releases) to download file

## Troubleshooting

If you see:

```bash
TabSync Local: could not find server
```

Make sure:

- The local server (tabsync) is running.
- You opened the extension on the same machine or network as the server.
- The port (3210 by default) is not blocked by a firewall.

## Changelog

For all the important changelog vist [Changelog](https://github.com/jayantur13/tabsync-extension/blob/main/Changelog.md)

## Contributing

Contributions are always welcome!

See [Contributing](https://github.com/jayantur13/tabsync-extension/blob/main/CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [Code Of Conduct](https://github.com/jayantur13/tabsync-extension/blob/main/CODE_OF_CONDUCT.md).

## Support

Support the developers for this project to live long.For issues, open a new issue or use discussion.

## License

This project is licensed under the [MIT License](https://github.com/jayantur13/tabsync-extension/blob/main/LICENSE)
