// i18n 회귀 테스트
// 방어 대상: en/ko 키 불일치. 과거 tools_regex.match/index 키가 누락되어
// 정규식 테스터 매칭 결과에 원시 키 문자열이 그대로 노출되던 문제.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

const en = JSON.parse(fs.readFileSync(root + '/i18n/en.json', 'utf8'));
const ko = JSON.parse(fs.readFileSync(root + '/i18n/ko.json', 'utf8'));

// 중첩 객체를 점 표기 키 목록으로 평탄화
function collectKeys(obj, prefix, out) {
  for (const k of Object.keys(obj)) {
    const p = prefix ? prefix + '.' + k : k;
    const v = obj[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) collectKeys(v, p, out);
    else out.push(p);
  }
  return out;
}

test('both locale files parse as valid JSON objects', () => {
  assert.ok(en && typeof en === 'object');
  assert.ok(ko && typeof ko === 'object');
});

test('en and ko share an identical key set (catches missing translations)', () => {
  const enKeys = collectKeys(en, '', []).sort();
  const koKeys = collectKeys(ko, '', []).sort();
  const onlyEn = enKeys.filter((k) => !koKeys.includes(k));
  const onlyKo = koKeys.filter((k) => !enKeys.includes(k));
  assert.deepStrictEqual(onlyEn, [], 'keys only in en: ' + onlyEn.join(', '));
  assert.deepStrictEqual(onlyKo, [], 'keys only in ko: ' + onlyKo.join(', '));
});

test('previously-missing regex keys exist in both locales', () => {
  for (const key of ['match', 'index', 'no_matches']) {
    assert.ok(en.tools_regex[key], 'missing en.tools_regex.' + key);
    assert.ok(ko.tools_regex[key], 'missing ko.tools_regex.' + key);
  }
});

test('no translation value is left as an empty string', () => {
  const empties = collectKeys(en, '', []).filter((k) => {
    const val = k.split('.').reduce((o, kk) => (o ? o[kk] : undefined), en);
    return val === '';
  });
  assert.deepStrictEqual(empties, [], 'empty en values: ' + empties.join(', '));
});
