const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'assets', 'spc-landing', 'crops');
const destAssets = path.join(__dirname, '..', 'assets');
const destPreviewAssets = path.join(__dirname, '..', 'preview', 'assets');

fs.mkdirSync(destPreviewAssets, { recursive: true });

const files = fs.readdirSync(srcDir);
for (const file of files) {
  const src = path.join(srcDir, file);
  fs.copyFileSync(src, path.join(destAssets, file));
  fs.copyFileSync(src, path.join(destPreviewAssets, file));
  console.log(`Copied ${file} to assets/ and preview/assets/`);
}
