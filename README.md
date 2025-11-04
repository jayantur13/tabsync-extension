<p align="center">
  <img src="/src/icons/icon128.png" width="80" />
  <h2 align="center">TabSync – Local Browser Sync (Extension)</h2>
  <p align="center">
   <b>TabSync Extension</b> automatically shares your open browser tabs with the local <b>TabSync CLI or electron based desktop app</b> server — no internet, no cloud, just your Wi-Fi.  
  </p>
</p>

## Must download one companion

- Nodejs [`tabsync-cli`](https://www.npmjs.com/package/tabsync-cli) [`tabsync-cli source`](https://github.com/jayantur13/tabsync-cli).
- Electron based [`tabsync-desktop`](https://github.com/jayantur13/tabsync-desktop)

---

## Features

- Detects all open tabs in your browser.
- Connects automatically to your **local TabSync server** (`http://localhost:port`).
- Syncs tab titles and URLs in real time over WebSocket.
- Updates instantly when you:
  - Open a new tab
  - Close a tab
  - Switch or reload a tab

On your desktop or mobile browser, you’ll see all connected devices and their open tabs live realtime

---

## Screenshot

![tabsync-screenshot](/src/other/ss1.png "TBSS")

---

## Requirements

- You must have the TabSync Local server installed either via:

```bash
npm install -g tabsync-cli
```

- Or, downlaod and use the electron based tabsync-desktop app from [`tabsync-desktop`](https://github.com/jayantur13/tabsync-desktop)

> Once started, it’ll show a local URL (e.g. http://192.168.x.x:port) and a QR code to open on other devices.

> The extension connects automatically to that local server via http://localhost:port/ip.

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
TabSync Local: could not find server on port xxxx
```

Make sure:

- The local server (tabsync) is running (via CLI or the electron app).
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
