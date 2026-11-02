import { DEFAULT_THEME_ID, loadThemes } from "./themes/index.js";

// Storage holds the whole chosen theme, so the content script needs no theme files.
// Rewriting it here on every install or update keeps it in step with the JSON.
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled = true, theme } = await chrome.storage.sync.get(["enabled", "theme"]);
  const themes = await loadThemes();
  const id = theme?.id ?? DEFAULT_THEME_ID;
  const current = themes.find((t) => t.id === id) ?? themes.find((t) => t.id === DEFAULT_THEME_ID);
  await chrome.storage.sync.set({ enabled, theme: current });
});
