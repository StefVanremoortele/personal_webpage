// Regenerate the OG card. Run: `node scripts/generate-og.mjs`.
// Output: public/og.png (1200x630).
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const NAME = "Stef Vanremoortele";
const TITLE = "Software Developer & Security Specialist";
const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const URL = "stefvanremoortele.be";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="180" fill="#262626" opacity="0.6"/>
  <circle cx="240" cy="520" r="120" fill="#262626" opacity="0.5"/>
  <text x="80" y="170" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="22" letter-spacing="4" font-weight="500">${escapeXml(TITLE.toUpperCase())}</text>
  <text x="80" y="320" fill="#ededed" font-family="system-ui, -apple-system, sans-serif" font-size="92" font-weight="600">${NAME}.</text>
  <text x="80" y="400" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400">Backend-first. Security-minded. Soft spot for clean UX.</text>
  <text x="80" y="560" fill="#6b7280" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500">${URL}</text>
</svg>
`;

const out = "public/og.png";
const buf = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, buf);
console.log(`wrote ${out} (${buf.length} bytes)`);
