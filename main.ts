// News-image entry for 25 November 2026 (Node 22, standard library only).
// The front page is the entry.png beside this file; the program copies it
// byte-for-byte to /output/entry.png, so repeated runs are identical.
// After copying it self-checks the gate: PNG magic bytes, dimensions from
// the IHDR chunk (at most 1024 by 1024), and size at most 1 MiB.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);

// Self-check: the copy must be byte-identical and pass the entry gate.
const bytes = readFileSync(dest);
const orig = readFileSync(src);
if (!bytes.equals(orig)) throw new Error('entry.png copy differs from source');
if (bytes.length > 1048576) throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB gate`);
if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
  throw new Error('entry.png is not a PNG');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}
console.log(`entry.png OK: ${width}x${height}, ${bytes.length} bytes`);
