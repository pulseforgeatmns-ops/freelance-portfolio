# gopulseforge.com — Agency Site

Modern, polished agency site. Deploys to GitHub Pages from this folder.

## Structure

```
/
├── index.html               # Home (TODO)
├── privacy.html             # Privacy Policy (DONE — GBP-compliant)
├── terms.html               # Terms of Service (TODO)
├── services.html            # Services (TODO)
├── case-studies.html        # Work (TODO)
├── about.html               # About (TODO)
├── pricing.html             # Pricing (TODO)
├── contact.html             # Contact (TODO)
├── assets/
│   ├── css/site.css         # Shared design system (DONE)
│   └── js/site.js           # Shared interactions (DONE)
└── README.md                # This file
```

## Design system (locked May 31, 2026)

- **Base**: `#050505` dark, `#f4f1ea` warm off-white text
- **Accent (sparing)**: `#ff7a1a` ember — used only for sparks, cursor hover, case-study arrows
- **Type**: Boska (Fontshare, display + italic emphasis), Switzer (Fontshare, body)
- **Hook**: hero waveform canvas throwing sparks (the brand-truthful pulse-into-forge motif)
- **Pattern**: italic emphasis on functional words as a system, year-organized work, capability bands with mono-style data panels

## Deploy

This drops into the existing gopulseforge.com repo as a flat structure. No build step. Just commit the files and GitHub Pages serves them. The custom domain settings already exist; no DNS changes needed.

## Browser support

- Modern evergreen browsers (Chrome, Safari, Firefox, Edge — last two versions)
- Canvas animation degrades gracefully on `prefers-reduced-motion`
- Custom cursor disables on touch devices
- Mobile-first responsive

## Page priority (build order)

1. ✅ Privacy Policy — done, GBP-application ready
2. ⏳ Terms of Service — next, ~1 hour boilerplate
3. ⏳ Home — main hero + value props + case studies preview
4. ⏳ Services — capability bands expanded with detail
5. ⏳ Case Studies index + MSHI deep-dive + Whittaker deep-dive
6. ⏳ About — founder bio, team framing
7. ⏳ Pricing — Starter / Growth / Pro / Enterprise tiers
8. ⏳ Contact — form + calendar embed

## TODOs before going live

- [ ] Replace mock numbers in Home hero stats with real `agent_log` queries
- [ ] Add favicon
- [ ] Add `<meta property="og:image">` social share images
- [ ] Test canvas performance on iPhone SE class device
- [ ] Verify `<head>` meta description / title on every page
- [ ] Submit updated sitemap.xml to Google Search Console after launch
- [ ] Fix the existing "Page with redirect" indexing issue in Search Console
