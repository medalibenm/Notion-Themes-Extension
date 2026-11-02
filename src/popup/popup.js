import { loadThemes } from "../themes/index.js";

// The popup only writes to storage; content.js in each tab does the restyling.
const grid = document.getElementById("themes");
const toggle = document.getElementById("enabled");

function renderSwatch({ tokens }) {
  const swatch = document.createElement("div");
  swatch.className = "swatch";
  swatch.innerHTML = `
    <div class="swatch-sidebar"></div>
    <div class="swatch-page">
      <div class="swatch-text"></div>
      <div class="swatch-accent"></div>
    </div>`;
  swatch.querySelector(".swatch-sidebar").style.background = tokens.sidebar;
  swatch.querySelector(".swatch-page").style.background = tokens.bg;
  swatch.querySelector(".swatch-text").style.background = tokens.text;
  swatch.querySelector(".swatch-accent").style.background = tokens.accent;
  return swatch;
}

function renderTheme(theme, selectedId) {
  const button = document.createElement("button");
  button.className = "theme";
  button.dataset.id = theme.id;
  button.setAttribute("aria-pressed", String(theme.id === selectedId));
  button.append(renderSwatch(theme), theme.name);
  button.addEventListener("click", () => {
    grid.querySelectorAll(".theme").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === button));
    });
    chrome.storage.sync.set({ theme });
  });
  return button;
}

async function init() {
  const [themes, { enabled, theme }] = await Promise.all([
    loadThemes(),
    chrome.storage.sync.get(["enabled", "theme"]),
  ]);
  grid.append(...themes.map((t) => renderTheme(t, theme?.id)));
  toggle.checked = enabled !== false;
  grid.classList.toggle("off", !toggle.checked);
  toggle.addEventListener("change", () => {
    grid.classList.toggle("off", !toggle.checked);
    chrome.storage.sync.set({ enabled: toggle.checked });
  });
}

init();
