// MD5 회귀 테스트
// 방어 대상: 이전에 희소 배열 + 길이 인코딩(>>>32) 버그로 모든 입력에 대해
// 잘못된 해시를 내던 결함. 실제 소스의 md5() 함수를 추출해 표준 벡터와 비교한다.
const test = require('node:test');
const assert = require('node:assert');
const crypto = require('node:crypto');
const { extractFunction, root } = require('./helpers');

eval(extractFunction(root + '/js/tools/hash-generator.js', 'md5'));

const refMd5 = (s) => crypto.createHash('md5').update(s, 'utf8').digest('hex');

test('MD5 matches RFC 1321 standard test vectors', () => {
  const vectors = [
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['a', '0cc175b9c0f1b6a831c399e269772661'],
    ['abc', '900150983cd24fb0d6963f7d28e17f72'],
    ['message digest', 'f96b697d7cb7938d525a2f31aaf161d0'],
    ['abcdefghijklmnopqrstuvwxyz', 'c3fcd3d76192e4007dfb496cca67e13b'],
    ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'd174ab98d277d9f5a5611c2c9f419d9f'],
    ['12345678901234567890123456789012345678901234567890123456789012345678901234567890', '57edf4a22be3c955ac49da2e2107b67a'],
  ];
  for (const [input, expected] of vectors) {
    assert.strictEqual(md5(input), expected, 'RFC vector failed for ' + JSON.stringify(input));
  }
});

test('MD5 handles non-ASCII (Korean/CJK/emoji) byte lengths correctly', () => {
  for (const s of ['한글', '안녕하세요 세계!', 'emoji 🚀 test', '日本語', 'Καλημέρα']) {
    assert.strictEqual(md5(s), refMd5(s), 'non-ASCII failed for ' + JSON.stringify(s));
  }
});

test('MD5 correct across 512-bit block boundaries', () => {
  for (const len of [55, 56, 57, 63, 64, 65, 119, 120, 128, 1000]) {
    const s = 'a'.repeat(len);
    assert.strictEqual(md5(s), refMd5(s), 'block boundary failed at len=' + len);
  }
});
