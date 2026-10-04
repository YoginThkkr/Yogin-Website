# Yogin Thakkar — Portfolio

Personal site for Yogin Thakkar, Higher Education leader in Accounting, Finance and Fintech.
Built with React, TypeScript, Vite, Tailwind CSS and Framer Motion. Deployed to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds into `dist/`.

## Editing content

All text lives in `src/data/portfolio.json`: profile, credentials, experience, education,
projects and the skills. Edit that file and the site updates.

- **CV download:** `public/Yogin-Thakkar-CV.pdf` is password protected (AES-256). To update it, protect the new PDF with a password first, then replace the file, keeping the name. The site says "Password protected. Email me for access".
- **Phone number:** `profile.social.phone` is empty on purpose, so it isn't shown publicly.
- **Avatars:** two characters, both in `public/` as `.webp` + `.png`:
  - `profile.avatar` is the intro character. Its head follows the mouse on computers and the
    finger on phones (plus one glance left and right after the page loads on phones): `avatar-front`, and
    `avatar-side-left` / `avatar-side-right` (the right one is a mirror of the left).
    The Projects section shows `avatar-side-right`, facing the projects.
  - `profile.avatarResume` is the Résumé character (`avatar-robot`, the tablet portrait).
  - Sticker positions: `RESUME_SPOTS` (Résumé character) and `FACE_SPOTS` (intro character) in
    `src/components/Medallion.tsx`. Remove both avatar blocks to fall back to the "YT" monogram.

## Deploying

The repo must be named **Yogin-Website** (it matches `base` in `vite.config.ts`).
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
If you use a different repo name, change `base` in `vite.config.ts` to `/<repo-name>/`.
