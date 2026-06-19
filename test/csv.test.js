// CSV↔JSON 변환기 회귀 테스트
// 방어 대상:
//  1) Tab 구분자 버그 — <option value="\t">가 리터럴 2글자로 전달되어 분할이 안 되던 문제
//  2) escapeCsv가 실제 구분자가 아닌 쉼표만 이스케이프하던 문제
const test = require('node:test');
const assert = require('node:assert');
const { extractFunction, root } = require('./helpers');

eval(extractFunction(root + '/js/tools/csv-json-converter.js', 'parseCSVLine'));
eval(extractFunction(root + '/js/tools/csv-json-converter.js', 'escapeCsv'));
eval(extractFunction(root + '/js/tools/csv-json-converter.js', 'getSep'));

test('getSep converts literal "\\t" to an actual tab character', () => {
  assert.strictEqual(getSep('\\t'), '\t');
  assert.strictEqual(getSep(','), ',');
  assert.strictEqual(getSep(';'), ';');
  assert.strictEqual(getSep(''), ',');          // 빈 값 → 기본 쉼표
  assert.strictEqual(getSep(undefined), ',');
});

test('parseCSVLine splits on an actual tab (regression: was a no-op)', () => {
  const tab = getSep('\\t');
  assert.deepStrictEqual(parseCSVLine('a\tb\tc', tab), ['a', 'b', 'c']);
});

test('parseCSVLine handles quoted fields and embedded separators', () => {
  assert.deepStrictEqual(parseCSVLine('a,"b,c",d', ','), ['a', 'b,c', 'd']);
  assert.deepStrictEqual(parseCSVLine('"he said ""hi"""', ','), ['he said "hi"']);
});

test('escapeCsv quotes values containing the ACTIVE separator (regression)', () => {
  assert.strictEqual(escapeCsv('a;b', ';'), '"a;b"');          // 세미콜론 구분자
  assert.strictEqual(escapeCsv('a,b', ','), '"a,b"');          // 쉼표 구분자
  assert.strictEqual(escapeCsv('plain', ','), 'plain');        // 이스케이프 불필요
  assert.strictEqual(escapeCsv('has "quote"', ','), '"has ""quote"""'); // 따옴표 이스케이프
});
