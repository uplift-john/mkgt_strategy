# FCR Brand & Marketing Playbook — Deployment Guide

## What This Is

A React web app that walks Trey and Shelby through building their complete brand and marketing strategy. Six guided sections, each with a mini-lesson and a form. Answers save automatically in the browser. When done, they can export everything as a formatted brand document.

---

## Option 1: Deploy to Vercel (Recommended — Free)

Vercel is the easiest path. Takes about 5 minutes.

### Step 1: Create accounts

- GitHub: https://github.com — Create a free account if you don't have one
- Vercel: https://vercel.com — Sign up with your GitHub account

### Step 2: Push this project to GitHub

1. Go to https://github.com/new and create a new repository (e.g., `fcr-brand-playbook`). Make it **private**.
2. Open Terminal on your Mac and run:

```bash
cd /path/to/fcr-playbook-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fcr-brand-playbook.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New → Project"**
3. Select your `fcr-brand-playbook` GitHub repo
4. Vercel will auto-detect Vite. Click **"Deploy"**
5. Your app goes live at `https://fcr-brand-playbook.vercel.app` (or a custom URL)

### Step 4 (Optional): Custom domain

In Vercel → Project Settings → Domains, you can add your own domain (e.g., `playbook.flatcreekranch.com`).

---

## Option 2: Deploy to Netlify (Also Free)

### Step 1: Install and build locally

Open Terminal and run:

```bash
cd /path/to/fcr-playbook-app
npm install
npm run build
```

This creates a `dist/` folder.

### Step 2: Deploy via Netlify drag-and-drop

1. Go to https://app.netlify.com
2. Create a free account
3. From the dashboard, drag the `dist/` folder onto the page that says **"Drag and drop your site folder here"**
4. Your app is live instantly — no GitHub needed

### Step 3 (Optional): Connect GitHub for auto-deploys

If you want the site to update automatically when you make changes, connect your GitHub repo in Netlify → Site Settings → Build & Deploy.

---

## Running Locally (For Testing)

If you want to preview the app on your own computer before deploying:

```bash
cd /path/to/fcr-playbook-app
npm install        # Install dependencies (first time only)
npm run dev        # Start the development server
```

Then open your browser to `http://localhost:5173`

---

## Customizing the App

### To add a video lesson

Open `src/App.jsx` and find the `VIDEOS` config near the top (around line 23):

```javascript
const VIDEOS = {
  icp: null,          // ← Replace null with your YouTube URL
  positioning: null,
  voice: null,
  stories: null,
  flywheel: null,
  audit: null,
};
```

Replace `null` with a YouTube URL in quotes, like:
```javascript
icp: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
```

### To use this for a different client

Everything client-specific is isolated in the top of `src/App.jsx`:
- `BRAND` config — client name and colors
- `VIDEOS` config — video URLs per section
- `SECTIONS` config — section titles and timing
- Lesson component content — the pre-filled teaching text

---

## Project File Structure

```
fcr-playbook-app/
├── public/
│   └── favicon.svg          ← Browser tab icon
├── src/
│   ├── App.jsx              ← The entire app (all components + logic)
│   ├── main.jsx             ← React entry point
│   └── index.css            ← Tailwind CSS imports
├── index.html               ← HTML shell
├── package.json             ← Dependencies
├── vite.config.js           ← Build config
├── tailwind.config.js       ← CSS framework config
├── postcss.config.js        ← CSS processing
├── vercel.json              ← Vercel deployment settings
├── netlify.toml             ← Netlify deployment settings
└── DEPLOY.md                ← This file
```

---

## Support

If something breaks or you need help, the key files are:
- **`src/App.jsx`** — all the app logic and content lives here
- **`package.json`** — lists all dependencies

The app requires Node.js 18+. Check your version with `node --version`.
