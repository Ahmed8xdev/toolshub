# Agent Tool Hub

A lightweight, browser based collection of helper tools for support and delivery operations. The interface uses a dark or light theme and a Three.js background. Each utility is a standalone HTML page, so the project can run locally without a bundler or backend.

> Independent demonstration project. Names appearing in the UI may refer to example workflows or services; this repository is not an official product of those organizations.

## Tools included

| Page | Purpose |
| :--- | :--- |
| [Home](./index.html) | Navigation dashboard for the available utilities |
| [CS Documentation Helper](./cs_doc.html) | Structured documentation editor with templates, quick actions, preview and history search |
| [Delay Calculator](./delay_calc.html) | Time based support calculations with failed trial, added time and refund SLA sections |
| [Late Owner Calculator](./late_owner.html) | Cancellation and delivery event timeline helper with delay reasons and guidance |

## Getting started

1. Clone the repository: `git clone https://github.com/Ahmed8xdev/toolshub.git`.
2. Open `index.html` in a current desktop or mobile browser.
3. Choose a tool from the dashboard. No package installation is required.

The interface loads some libraries and fonts from public CDNs, so an internet connection is useful. A simple local HTTP server can be used when browser file URL restrictions interfere with assets:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Technologies

HTML, JavaScript, Tailwind CSS through CDN, Three.js, Font Awesome and Google Fonts. The project is a browser application; no hosted API or server side customer data store is included in the checked in HTML.

## Data and privacy

Some views use browser `localStorage` for settings, templates or history. This is browser local storage, not a secured organizational records system. **Do not put confidential customer records, credentials, payment information or production personal data into the tools** unless you independently assess the implementation and have authorization to do so. Clear browser site data to remove locally stored information.

Calculation output is a convenience aid rather than an authoritative service policy. Confirm the actual policy and timestamps before using results for operational decisions.

## Contributing

Bug reports and reproducible improvement ideas are welcome. Include the page, browser, steps to reproduce and expected result. For contributions, keep each change focused, test in both light and dark modes, and check it at mobile widths.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for a checklist.

## License

MIT License, see [LICENSE](./LICENSE).
