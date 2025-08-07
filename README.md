# CookQuest — PWA Scaffold (GitHub Pages ready)

Log recipes, earn XP, and unlock ingredient/cuisine/method badges. **Installable PWA** with offline support. Static-exported and auto-deploys to **GitHub Pages**.

## Local dev
```
npm install
npm run dev
```
Open http://localhost:3000 and use the browser menu → **Install app**.

## Deploy to GitHub Pages
1. Create a new GitHub repo (any name).
2. Push this project:
   ```
   git init
   git add -A
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```
3. The GitHub Action **Deploy to GitHub Pages** runs on `main`. It builds to `out/` and publishes to the `gh-pages` branch.
4. Your site will be at **https://<USER>.github.io/<REPO>/**.
   - If your repo is named `<USER>.github.io`, it will be at **https://<USER>.github.io/**.

**No manual config needed**: the build auto-detects your repo name and sets `basePath`/`assetPrefix` so scripts/assets load from `/REPO_NAME/`.

## What’s inside
- Next.js 14 (App Router) with `output: 'export'` (static)
- PWA: `public/manifest.webmanifest` + `public/sw.js`
- IndexedDB via `idb` for local storage
- XP/level in `lib/xp.ts`
- Badge engine in `lib/badges.ts`
- Minimal mobile-first UI

## Roadmap
- Supabase auth + sync
- Web Push notifications
- Rule editor UI
- Streaks & quests
