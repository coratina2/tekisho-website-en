const fs = require('fs');
const path = require('path');

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

function injectLink(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('shared/style.css')) {
    console.log(`✅ 既に追加済み: ${filePath}`);
    return;
  }

  const updated = content.replace(
    /<head>/i,
    `<head>\n<link rel="stylesheet" href="../shared/style.css">`
  );

  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`🔧 追加完了: ${filePath}`);
}

walk('.', injectLink);
