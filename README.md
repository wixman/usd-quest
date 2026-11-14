# USDquest

A Duolingo-style OpenUSD learning app (sister app to jazz-piano-app).
Single static page: no build step. Edit `index.html` and push; GitHub Pages serves it.

- Live: https://wixman.github.io/usd-quest/
- Install: open the link on your phone → Share / ⋮ → **Add to Home Screen** for full screen.
- Progress is saved in the browser on each device (localStorage).

## Editing
Source lives in `src/` (c1.js–c6.js = curriculum in 5 parts, widgets.js = interactive lab widgets,
engine.js = app logic, style.css). Run `python build.py` to regenerate `index.html`,
then commit + push. Bump `CACHE` in `sw.js` if phones seem stuck on an old version.
