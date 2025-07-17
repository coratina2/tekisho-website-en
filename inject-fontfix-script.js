const fs = require('fs');
const path = require('path');

const scriptTag = `
<script>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.text[data-s], .sd[data-s], .sd.appear[data-s]').forEach(el => {
    if (el.style.fontWeight === '600' || el.style.fontWeight === '700') {
      el.style.fontWeight = '400';
    }
  });
  document.querySelectorAll('strong[data-s], b[data-s]').forEach(el => {
    el.style.fontWeight = 'normal';
  });
});
</script>
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

function injectScript(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');

  if (html.includes('document.querySelectorAll') && html.includes('fontWeight')) {
    console.log(`✅ 既に挿入済み: ${filePath}`);
    return;
  }

  const updated = html.replace(/<\/body>/i, `${scriptTag}\n</body>`);
  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`🔧 スクリプト挿入完了: ${filePath}`);
}

walk('.', injectScript);
