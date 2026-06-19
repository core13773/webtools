// 테스트 보조 유틸: 소스 파일에서 function 선언을 중괄호 카운팅으로 추출.
// (대상 함수들 내부에 중괄호를 포함한 문자열/정규식이 없으므로 안전합니다.)
const fs = require('node:fs');
const path = require('node:path');

function extractFunction(file, name) {
  const src = fs.readFileSync(file, 'utf8');
  const needle = 'function ' + name + '(';
  const start = src.indexOf(needle);
  if (start === -1) throw new Error('function ' + name + ' not found in ' + file);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced braces for ' + name + ' in ' + file);
}

module.exports = { extractFunction, root: path.resolve(__dirname, '..') };
