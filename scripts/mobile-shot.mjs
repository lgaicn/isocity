// Mobile-emulation screenshot tool (puppeteer-core + system Edge).
// Usage:
//   node scripts/mobile-shot.mjs <url> <outPrefix> [landscape|portrait]
// Example:
//   node scripts/mobile-shot.mjs http://110.42.226.125/ live landscape
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const shots = resolve(root, '..', 'spike-shots');
mkdirSync(shots, { recursive: true });

const url = process.argv[2] || 'http://127.0.0.1:3000/';
const prefix = process.argv[3] || 'dev';
const mode = process.argv[4] || 'landscape';

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
import { existsSync } from 'fs';
const edge = edgeCandidates.find(existsSync);
if (!edge) { console.error('Edge not found'); process.exit(1); }

const viewport = mode === 'landscape' ? { width: 915, height: 412 } : { width: 412, height: 915 };
const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

console.log(`shooting ${url} [${mode}] -> ${shots}\\${prefix}-*`);
const browser = await puppeteer.launch({ executablePath: edge, headless: true, args: ['--disable-gpu', '--no-first-run', '--hide-scrollbars'] });
try {
  const page = await browser.newPage();
  await page.setUserAgent(ua);
  await page.setViewport({ ...viewport, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: resolve(shots, `${prefix}-${mode}-menu.png`) });
  console.log('menu shot saved');

  // Enter the game (新游戏 / Continue)
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => /新游戏|Continue|New Game/.test(x.textContent || ''));
    if (b) { b.click(); return b.textContent; }
    return null;
  });
  console.log('start button clicked:', clicked || 'NOT FOUND');
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: resolve(shots, `${prefix}-${mode}-game.png`) });
  console.log('game shot saved');

  // Measure actual bar heights for diagnosis
  const metrics = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().height) : null;
    };
    return {
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      topBar: pick('.fixed.top-0'),
      bottomBar: pick('.fixed.bottom-0'),
    };
  });
  console.log('layout metrics:', JSON.stringify(metrics));
} finally {
  await browser.close();
}
