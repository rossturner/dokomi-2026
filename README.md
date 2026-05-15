# DoKomi Convention Day PWA

Phone-first installable app for the DoKomi 2026 invitee shortlist. Groups invitees by hall, supports a "contacted" toggle, works fully offline once installed.

Live URL: https://rossturner.github.io/dokomi-2026/

## Develop locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/dokomi-2026/.

## Tests

```bash
npm test
```

## Deploy

```bash
npm run build
git add docs
git commit -m "build: redeploy"
git push
```

GitHub Pages is configured to serve from `master` branch `/docs`. New commits to `docs/` go live within ~1 minute.

## Install on Android

1. On the Android device, open Chrome and navigate to https://rossturner.github.io/dokomi-2026/.
2. Either accept Chrome's install prompt at the bottom, or open the ⋮ menu and tap **Install app** or **Add to Home screen**.
3. The DoKomi icon appears on the home screen. Tapping it launches the app standalone, without the browser address bar.
4. After this first online load the app works fully offline. To pick up updates after a redeploy, open the app while online.

## Updating data

The data lives at `public/convention.json`. To add or change an invitee:

1. Edit `public/convention.json` directly.
2. Optionally add a photo at `public/photos/<slug>.png`.
3. `npm run build && git add docs && git commit -m "build: data update" && git push`.
4. Open the app on the phone while online — it auto-updates on next launch.

## Updating photos only

Drop `<slug>.png` files into `public/photos/` (slugs match `convention.json`). Rebuild and redeploy.
