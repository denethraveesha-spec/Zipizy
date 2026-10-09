# Zipizy

Everyday tools for files, text, QR codes and development. Free to use, with no account required.

Zipizy runs in a browser or as a Windows desktop app. PDF, image, text and QR processing happens on your device. Video thumbnail tools need internet access and contact YouTube or Vimeo.

## Download

Open [Releases](https://github.com/denethraveesha-spec/Zipizy/releases) and download the Windows x64 setup file. Run it and choose an installation folder. You do not need Git, Node.js or a developer account.

The initial installer is unsigned. Windows may show an unknown-publisher warning. Verify the release source and SHA-256 checksum before deciding whether to run it. Updates are manual: download the next installer from Releases.

## Tools

| Area | Included tools |
| --- | --- |
| Documents | Merge PDFs, extract pages, split into a ZIP, password protection, JPG/PNG/HEIC to PDF |
| QR codes | Text/link, Wi-Fi, contact card, WhatsApp |
| Text | Word count, case conversion, Base64 |
| Development | JSON formatting and comparison, regex testing, UUIDs, file/text hashes |
| Images & video | Image cropper, aspect-ratio calculator, YouTube and Vimeo thumbnails |

Search the tool library or filter by category. Local processing tools work without internet in the desktop app. No paid AI API or subscription is required.

## Run from source

Use Node.js 24 LTS and npm.

```sh
git clone https://github.com/denethraveesha-spec/Zipizy.git
cd Zipizy
npm ci
npm run dev -- --background
```

The development server prints its address. Stop it with `npm run astro -- dev stop`.

```sh
npm test
npm run build
npm run desktop
npm run dist:win
```

`desktop` opens the built site. `dist:win` rebuilds the site and writes the installer to `release/`. The desktop shell serves bundled assets from its own local origin, with Node access disabled in pages. It does not run a local HTTP server.

## Limits

- This is an initial release, not a guarantee of error-free handling of every file format.
- Password-protected inputs must be unlocked before merging, splitting or re-protecting PDFs. Keep your own copy of passwords; the app cannot recover them.
- HEIC support depends on the bundled decoder. Unsupported variants report a conversion error.
- Regex checks stop after 1.5 seconds and display at most 1,000 matches. The input limit is 100,000 characters.
- JSON comparison sorts object keys but preserves array order. Large comparisons are limited to protect responsiveness. JSON numbers use JavaScript number precision.
- Large files can use substantial memory. There is no background queue or automatic recovery of unfinished work.
- Video services can block thumbnail requests or omit particular resolutions. Those tools cannot work offline.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). For problems, open an issue with steps to reproduce and the app/browser version. Use sample files without personal information.

Built by [Deneth Raveesha](https://github.com/denethraveesha-spec). Licensed under [MIT](LICENSE). Dependencies retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
