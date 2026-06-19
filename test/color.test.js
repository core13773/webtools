// Color 변환기 회귀 테스트 — 3자리 HEX 확장 로직 검증.
const test = require('node:test');
const assert = require('node:assert');
const { extractFunction, root } = require('./helpers');

eval(extractFunction(root + '/js/tools/color-picker.js', 'expandHex'));

test('expandHex expands 3-digit hex to 6-digit', () => {
  assert.strictEqual(expandHex('#abc'), '#aabbcc');
  assert.strictEqual(expandHex('#FFF'), '#FFFFFF');
  assert.strictEqual(expandHex('#1a2'), '#11aa22');
});

test('expandHex passes 6-digit hex through unchanged', () => {
  assert.strictEqual(expandHex('#4f46e5'), '#4f46e5');
  assert.strictEqual(expandHex('#000000'), '#000000');
});
