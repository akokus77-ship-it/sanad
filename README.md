# Sanad
Bilingual invoice and quotation PDF app (Arabic + English).
Static site for Hostinger. Intended domain: afokus.net
Not a ZATCA-certified e-invoice.

سند is an Arabic-first web app for Saudi and Gulf small businesses. Create a simple invoice or quotation in the browser and download a PDF. VAT at 15% is optional. There is no backend, no account, and no payment flow. Free PDFs include a small **Made with Sanad** watermark.

Every document footer includes:

> This is a simple invoice/quotation, not a ZATCA-certified e-invoice. Not tax advice.

Sanad does not claim ZATCA e-invoicing, Phase 2 XML, or tax advice.

## Hostinger static hosting

This repository root **is** the website. After a build it contains `index.html` and `_next/` (not nested under `out/` or `dist/`).

Intended domain: **afokus.net**

1. Point the website document root at these files, **or** unzip the repository into `public_html` so that `index.html` sits next to `_next/`.
2. In hPanel, use static website hosting (or a domain whose document root is this folder). Do not start a Node.js application for production.
3. Open `https://afokus.net`. The app runs entirely in the visitor’s browser.

Typical layout after unzip:

```
public_html/
  index.html
  _next/
  404.html
  icon.svg
  README.md
```

## Rebuild the static files

Requires Node.js 20+.

```bash
npm install
npm run build
```

`next.config.ts` uses `output: 'export'`. The build copies `out/` up to the repository root so Hostinger can serve `index.html` and `_next/` from the same folder as this README.

## What it does

- Arabic (default, RTL) and English
- Invoice or quotation
- Seller and client fields, line items, discount, Gulf currencies (SAR default)
- Optional 15% VAT
- In-browser PDF download and print
- Draft saved in `localStorage` only
