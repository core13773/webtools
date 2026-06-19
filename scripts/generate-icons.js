// PWA 아이콘 PNG 생성 스크립트. icons/*.svg 소스로부터 resvg로 래스터화.
// 사용: npm run icons  (사전에 npm install 필요 — @resvg/resvg-js)
// Arial 폰트는 생성 머신에 존재해야 하며, 결과 PNG에는 글리프가 래스터화되어 포함됨.
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'icons');

// any 목적용: 둥근 사각형 로고 (소스 icon-512.svg와 동일 디자인, 폰트는 렌더링 안정화를 위해 Arial)
const anySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#4f46e5"/>
  <text x="256" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="205" font-weight="800" fill="#fff">W</text>
  <text x="312" y="352" text-anchor="middle" font-family="Arial, sans-serif" font-size="112" font-weight="800" fill="#a5b4fc">T</text>
</svg>`;

// maskable 목적용: 전면 채움 배경 + 안전영역(중앙 ~80%) 안의 작은 로고.
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#4f46e5"/>
  <text x="256" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="150" font-weight="800" fill="#fff">W</text>
  <text x="300" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="82" font-weight="800" fill="#a5b4fc">T</text>
</svg>`;

function render(svg, size, file) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(path.join(outDir, file), png);
  console.log('✓ ' + file + '  (' + png.length + ' bytes)');
}

render(anySvg, 192, 'icon-192.png');
render(anySvg, 512, 'icon-512.png');
render(maskableSvg, 512, 'icon-maskable-512.png');
console.log('icons generated');
