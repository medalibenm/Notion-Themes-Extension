// Runs at document_start. base.css is declared in the manifest, so it is already
// loaded here; it stays inert until <html data-tint> is set.

// chrome.storage is async, so waiting for it would flash Notion's default theme.
// This per-site copy of the last applied theme is readable synchronously.
const CACHE_KEY = "tint-theme";

// textMuted -> --tint-text-muted
function tokenToVar(name) {
  return "--tint-" + name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}

function themeToCss(theme) {
  const { colors, ...tokens } = theme.tokens;
  const vars = Object.entries({ ...tokens, ...colors })
    .map(([name, value]) => `${tokenToVar(name)}: ${value};`)
    .join(" ");
  return `html[data-tint] { color-scheme: ${theme.base}; ${vars} }`;
}

function applyCss(id, css) {
  const root = document.documentElement;
  let style = document.getElementById("tint-vars");
  if (!style) {
    style = document.createElement("style");
    style.id = "tint-vars";
    root.appendChild(style); // <head> does not exist yet at document_start
  }
  style.textContent = css;
  root.dataset.tint = id;
}

function clearTheme() {
  delete document.documentElement.dataset.tint;
  document.getElementById("tint-vars")?.remove();
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
}

function writeCache(value) {
  try {
    if (value) localStorage.setItem(CACHE_KEY, JSON.stringify(value));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage blocked: themes still apply, just without the first-paint cache.
  }
}

async function syncFromStorage() {
  const { enabled, theme } = await chrome.storage.sync.get(["enabled", "theme"]);
  if (enabled && theme) {
    const css = themeToCss(theme);
    applyCss(theme.id, css);
    writeCache({ id: theme.id, css });
  } else {
    clearTheme();
    writeCache(null);
  }
}

const cached = readCache();
if (cached) applyCss(cached.id, cached.css);

syncFromStorage();
chrome.storage.onChanged.addListener((_changes, area) => {
  if (area === "sync") syncFromStorage();
});
