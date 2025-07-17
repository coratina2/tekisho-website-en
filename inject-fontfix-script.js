const fs = require('fs');
const path = require('path');

const scriptTag = `
<script>
document.addEventListener("DOMContentLoaded", function () {
  // 自動的に強調されてしまう .text や .sd クラスで、data-s付き要素に限定して補正
  document.querySelectorAll('.text[data-s], .sd[data-s], .sd.appear[data-s]').forEach(el => {
    const weight = getComputedStyle(el).fontWeight;
    if (weight === '600' || weight === '700' || Number(weight) > 500) {
      el.style.fontWeight = '400';
    }
  });

  // strong, b タグで意図せず太くなってる data-s付き要素もリセット
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

  if (html.includes('inject font-weight fix')) {
    console.log(`✅ 既に挿入済み: ${filePath}`);
    return;
  }

  const updated = html.replace(
    /<\/body>/i,
    `${scriptTag}\n</body>`
  );

  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`🔧 スクリプト挿入完了: ${filePath}`);
}

walk('.', injectScript);
