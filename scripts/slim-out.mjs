// Slim the static export (out/) before packaging into APK / deploying.
// Run after `next build` and before `npx cap sync android`.
//
// Removes:
//  1. out/assets/**/*.png — every one has a .webp twin; src/components/game/imageLoader.ts
//     prefers WebP when the browser supports it (Android WebView does). Saves ~315MB.
//  2. out/games — unreferenced camera photos shipped in upstream public/games. Saves ~26MB.
//
// Kept on purpose:
//  - out/example-states & example-states-coaster — referenced by SettingsPanel.tsx
//    ("load example" buttons) and the coaster menu.
import { rmSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const out = 'out';
let removed = 0;

function walkAndRemovePngWithWebpTwin(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndRemovePngWithWebpTwin(p);
    } else if (entry.name.endsWith('.png')) {
      const webp = p.replace(/\.png$/, '.webp');
      if (existsSync(webp)) {
        const kb = (statSync(p).size / 1024).toFixed(0);
        rmSync(p);
        removed++;
        console.log(`  removed ${p} (${kb} KB)`);
      }
    }
  }
}

if (!existsSync(out)) {
  console.error('slim-out: out/ not found — run `next build` first.');
  process.exit(1);
}

console.log('slim-out: removing .png with .webp twins under out/assets ...');
walkAndRemovePngWithWebpTwin(join(out, 'assets'));

if (existsSync(join(out, 'games'))) {
  rmSync(join(out, 'games'), { recursive: true });
  removed++;
  console.log('  removed out/games (unreferenced photos)');
}

console.log(`slim-out: done, ${removed} items removed.`);
