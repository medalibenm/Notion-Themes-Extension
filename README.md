# Tint for Notion

Color themes for Notion on the web. Switch themes live from a small popup, with no page reload. Runs only on Notion pages and collects no data.

Unofficial: not affiliated with or endorsed by Notion. The Notion desktop app is not supported, because browser extensions can't reach it.

## Themes

Nord, Dracula, Catppuccin Mocha, Rosé Pine, Solarized Light and High Contrast. Each theme works whether Notion itself is in light or dark mode.

## Install from source

1. Open `chrome://extensions` (or `edge://extensions`) and turn on Developer mode.
2. Click **Load unpacked** and select this folder.
3. Reload any open Notion tabs.

There is no build step. After changing a file, click the reload icon on the extension, then reload Notion.

## How it works

`src/base.css` is declared in the manifest and does nothing until `<html data-tint>` is set. `src/content.js` sets that attribute and writes the chosen theme as `--tint-*` variables. `base.css` maps Notion's own design tokens (`--c-*`, `--ca-*`, `--cd-*`, `--cl-*`) onto those variables.

The popup only writes to `chrome.storage.sync`; the content script in each tab does the restyling.

Every Notion-specific name lives in `src/base.css`, grouped by UI area, so a fix after a Notion update is usually one edit.

## Add a theme

1. Copy a file in `src/themes/` and change its `id`, `name`, `base` (`light` or `dark`) and colors.
2. Add the `id` to `THEME_IDS` in `src/themes/index.js`.
3. Keep text at 4.5:1 contrast or better against `bg`, `sidebar` and `codeBg`.

No CSS changes are needed.

## After a Notion update

Work through `test/checklist.md` in each theme. Prefer remapping a token over adding a selector.

## Release

On Windows, run this from this folder:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\release.ps1
```

It writes `dist/tint-for-notion-<version>.zip`, containing only the files the extension needs.
