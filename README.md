# Abhyanshu Raj — Portfolio

A React + Vite portfolio site, framed as a code editor: every section is
literally the file it represents (`hero.tsx`, `about.md`, `education.json`,
`package.json`, `/projects`, `git log`, `contact`).

## Run locally

```bash
npm i
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

`npm run build` outputs a static `dist/` folder you can deploy anywhere
(Vercel, Netlify, GitHub Pages, etc.) — just point the host at `dist`.

## Structure

```
index.html        entry HTML (Vite root)
src/main.jsx       React mount point
src/App.jsx        the whole portfolio (single component)
vite.config.js      Vite + React plugin config
package.json        dependencies (react, react-dom, lucide-react)
```
