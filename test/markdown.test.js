// Markdown 프리뷰어 회귀 테스트 — GFM 표·인용구·수평선 렌더링 검증.
const test = require('node:test');
const assert = require('node:assert');
const { extractFunction, root } = require('./helpers');

eval(extractFunction(root + '/js/tools/markdown-previewer.js', 'escapeHtml'));
eval(extractFunction(root + '/js/tools/markdown-previewer.js', 'parseMarkdown'));

test('GFM table renders header and body cells', () => {
  const md = '| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |';
  const html = parseMarkdown(md);
  assert.ok(html.includes('<table>'), 'contains <table>');
  assert.ok(html.includes('<th>Name</th>'), 'header cell');
  assert.ok(html.includes('<td>Alice</td>'), 'body cell');
  assert.ok(html.includes('<td>30</td>'), 'body cell value');
});

test('table column alignment is applied', () => {
  const md = '| L | C | R |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |';
  const html = parseMarkdown(md);
  assert.ok(html.includes('text-align:left'), 'left align');
  assert.ok(html.includes('text-align:center'), 'center align');
  assert.ok(html.includes('text-align:right'), 'right align');
});

test('blockquote renders', () => {
  const html = parseMarkdown('> a wise quote');
  assert.ok(html.includes('<blockquote>'), 'contains <blockquote>');
  assert.ok(html.includes('a wise quote'));
});

test('horizontal rule renders', () => {
  for (const rule of ['---', '***', '___']) {
    const html = parseMarkdown('above\n\n' + rule + '\n\nbelow');
    assert.ok(html.includes('<hr>'), 'hr for ' + rule);
  }
});

test('basic headings and bold still work', () => {
  const html = parseMarkdown('# Title\n**bold**');
  assert.ok(html.includes('<h1>'), 'heading');
  assert.ok(html.includes('<strong>bold</strong>'), 'bold');
});
