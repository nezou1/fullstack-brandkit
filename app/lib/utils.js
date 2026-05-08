import { MOODS } from "./moods";
import { FONT_DUOS } from "./fonts";

export function extractColorsFromImage(img, count = 5) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 120;
  canvas.height = 120;
  ctx.drawImage(img, 0, 0, 120, 120);
  const data = ctx.getImageData(0, 0, 120, 120).data;
  const buckets = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    if (data[i + 3] < 128) continue;
    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
  const result = [];
  for (const [key] of sorted) {
    const [r, g, b] = key.split(",").map(Number);
    const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    const isDupe = result.some((c) => {
      const cr = parseInt(c.slice(1, 3), 16);
      const cg = parseInt(c.slice(3, 5), 16);
      const cb = parseInt(c.slice(5, 7), 16);
      return Math.abs(cr - r) + Math.abs(cg - g) + Math.abs(cb - b) < 80;
    });
    if (!isDupe) result.push(hex);
    if (result.length >= count) break;
  }
  while (result.length < count) result.push("#F5F5F5");
  return result;
}

export function detectMoodFromColors(colors) {
  let bestMood = "_default";
  let bestDist = Infinity;
  const toRGB = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const dist = (a, b) => { const [r1, g1, b1] = toRGB(a); const [r2, g2, b2] = toRGB(b); return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2); };
  for (const mood of MOODS) {
    let d = 0;
    for (let i = 0; i < Math.min(3, colors.length, mood.colors.length); i++) d += dist(colors[i], mood.colors[i]);
    if (d < bestDist) { bestDist = d; bestMood = mood.id; }
  }
  return bestMood;
}

export function getDuosForMood(moodId) {
  return FONT_DUOS[moodId] || FONT_DUOS._default;
}

export function loadGoogleFont(name) {
  if (typeof window === "undefined") return;
  const id = `gf-${name.replace(/\s/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function getPixelColor(canvas, x, y) {
  const ctx = canvas.getContext("2d");
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return "#" + [pixel[0], pixel[1], pixel[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
}
