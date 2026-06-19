// Slug 생성기 회귀 테스트 — 핵심 toSlug() 변환 로직 검증.
const test = require('node:test');
const assert = require('node:assert');
const { extractFunction, root } = require('./helpers');

eval(extractFunction(root + '/js/tools/slug-generator.js', 'toSlug'));

test('basic slug from a title with spaces and punctuation', () => {
  assert.strictEqual(toSlug('10 Tips for Better SEO in 2026!', '-', true), '10-tips-for-better-seo-in-2026');
});

test('lowercase toggle off preserves case', () => {
  assert.strictEqual(toSlug('Hello World', '-', false), 'Hello-World');
});

test('underscore separator', () => {
  assert.strictEqual(toSlug('Hello World Foo', '_', true), 'hello_world_foo');
});

test('accents are folded to ASCII (é -> e)', () => {
  assert.strictEqual(toSlug('Café déjà vu', '-', true), 'cafe-deja-vu');
  assert.strictEqual(toSlug('Naïve résumé', '-', true), 'naive-resume');
});

test('multiple spaces and symbols collapse to a single separator', () => {
  assert.strictEqual(toSlug('Hello,   World!!!', '-', true), 'hello-world');
});

test('leading/trailing separators are trimmed', () => {
  assert.strictEqual(toSlug('  hello  ', '-', true), 'hello');
  assert.strictEqual(toSlug('---hello---', '-', true), 'hello');
});

test('empty or non-ASCII-only input yields empty slug', () => {
  assert.strictEqual(toSlug('   ', '-', true), '');
  assert.strictEqual(toSlug('!!!', '-', true), '');
});
