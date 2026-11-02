// Built-in themes. To add one, drop a JSON file here and list its id.
const THEME_IDS = [
  "nord",
  "dracula",
  "catppuccin-mocha",
  "rose-pine",
  "solarized-light",
  "high-contrast",
];

export const DEFAULT_THEME_ID = "nord";

export function loadThemes() {
  return Promise.all(
    THEME_IDS.map(async (id) => {
      const response = await fetch(chrome.runtime.getURL(`src/themes/${id}.json`));
      return response.json();
    })
  );
}
