const fs = require('fs');
const path = require('path');

const styleTag = `
<style>
.sd[data-s], .text[data-s], .sd.appear[data-s] {
  font-weight: 400 !important;
}
strong, b {
  font-weight: normal !important;
}
</style>
`;

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (file === 'index.html') {
      callback(fullPath);
    }
  });
}

function injectStyle(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');

  // すでに styleTag が含まれていればスキップ
  if (html.includes('.sd[data-s]') || html.includes('font-weight: 400')) {
    console.log(`✅ 既に挿入済み: ${filePath}`);
    return;
  }

  // <head> にスタイルを挿入
  const updated = html.replace(/<head[^>]*>/i, match => `${match}\n${styleTag}`);
  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`🔧 スタイル挿入完了: ${filePath}`);
}

walk('.', injectStyle);
