import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

function createSvg(size, maskable = false) {
  const padding = maskable ? size * 0.15 : 0;
  const inner = size - padding * 2;
  const fontSize = inner * 0.45;
  const starSize = inner * 0.12;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" fill="#1a0033" rx="${maskable ? inner * 0.1 : 0}"/>
  <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" font-weight="bold" fill="#ff00cc" font-family="Comic Sans MS, cursive">$</text>
  <text x="${padding + starSize}" y="${padding + starSize * 2}" font-size="${starSize}" fill="#ffff00">★</text>
  <text x="${size - padding - starSize * 2}" y="${padding + starSize * 2}" font-size="${starSize}" fill="#00ffff">★</text>
  <text x="${size / 2}" y="${size - padding - starSize}" text-anchor="middle" font-size="${starSize * 0.8}" fill="#9933ff">★</text>
</svg>`;

  return Buffer.from(svg);
}

async function generate() {
  const sizes = [
    { name: "pwa-192x192.png", size: 192 },
    { name: "pwa-512x512.png", size: 512 },
    { name: "pwa-512x512-maskable.png", size: 512, maskable: true },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size, maskable } of sizes) {
    const png = await sharp(createSvg(size, maskable)).png().toBuffer();
    writeFileSync(join(publicDir, name), png);
    console.log(`Generated ${name}`);
  }
}

generate().catch(console.error);
