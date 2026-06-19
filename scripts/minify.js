// 로컬에서 실행 가능한 CSS/JS 압축 스크립트.
// GitHub Actions(.github/workflows/minify.yml)의 csso + terser 동작과 동일.
// 사용: npm run minify  (사전에 npm install 필요)
const fs = require('node:fs');
const path = require('node:path');
const csso = require('csso');
const { minify: terserMinify } = require('terser');

const root = path.resolve(__dirname, '..');
const cssFiles = ['css/style.css', 'css/tools.css'];
const jsFiles = [
  'js/i18n.js', 'js/app.js', 'js/layout.js',
  ...fs.readdirSync(path.join(root, 'js/tools'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => 'js/tools/' + f),
];

function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, data) { fs.writeFileSync(path.join(root, rel), data); }

(async () => {
  for (const f of cssFiles) {
    const out = csso.minify(read(f)).css;
    write(f, out);
    console.log('✓ css  ' + f + '  (' + out.length + ' bytes)');
  }
  for (const f of jsFiles) {
    // 테스트(test/)가 함수명으로 추출하므로 해당 이름은 맹글링에서 보존.
    const res = await terserMinify(read(f), {
      compress: true,
      mangle: { reserved: ['md5', 'toSlug', 'parseCSVLine', 'escapeCsv', 'getSep'] },
    });
    if (res.error) throw res.error;
    write(f, res.code);
    console.log('✓ js   ' + f + '  (' + res.code.length + ' bytes)');
  }
  console.log('minify complete');
})().catch((e) => { console.error(e); process.exit(1); });
