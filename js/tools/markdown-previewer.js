const mdInput = document.getElementById('md-input');
const preview = document.getElementById('md-preview');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parseMarkdown(md) {
  if (!md) return '';
  let html = escapeHtml(md);
  // Code blocks first (before other transformations)
  html = html.replace(/```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>');
  // Horizontal rule (--- / *** / ___ on its own line)
  html = html.replace(/^(?:-{3,}|\*{3,}|_{3,})[ \t]*$/gm, '<hr>');
  // Blockquote: consecutive lines starting with '> ' (escaped to '&gt; ')
  html = html.replace(/^&gt; ?(.*)$/gm, '<bq>$1</bq>');
  html = html.replace(/(?:<bq>.*<\/bq>\n?)+/g, function(match){
    return '<blockquote>' + match.replace(/<\/?bq>/g, '').replace(/\n/g, '<br>').trim() + '</blockquote>';
  });
  // GFM table: header row, separator row (with optional :align:), then body rows
  html = html.replace(/^(\|[^\n]+)\n(\|[\s:|\-]+)\n((?:\|[^\n]+\n?)+)/gm, function(match, headerRow, sepRow, bodyRows){
    var parseRow = function(row){ return row.replace(/^\s*\||\|\s*$/g, '').split('|'); };
    var aligns = parseRow(sepRow).map(function(c){
      c = c.trim();
      if(/^:-+:$/.test(c)) return 'center';
      if(/^:-+$/.test(c)) return 'left';
      if(/^-+:$/.test(c)) return 'right';
      return '';
    });
    var makeCell = function(content, i, tag){
      var a = aligns[i] ? ' style="text-align:' + aligns[i] + '"' : '';
      return '<' + tag + a + '>' + content.trim() + '</' + tag + '>';
    };
    var head = parseRow(headerRow).map(function(c, i){ return makeCell(c, i, 'th'); }).join('');
    var rows = bodyRows.trim().split('\n').map(function(r){
      return '<tr>' + parseRow(r).map(function(c, i){ return makeCell(c, i, 'td'); }).join('') + '</tr>';
    }).join('');
    return '<table><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table>';
  });
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  // Sanitize javascript: protocol in links and images
  html = html.replace(/!\[([^\]]*)\]\((\s*javascript:[^\)]*)\)/gim, '<img alt="$1" src="" style="max-width:100%">');
  html = html.replace(/\[([^\]]+)\]\((\s*javascript:[^\)]*)\)/gim, '<a href="#" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" style="max-width:100%">');
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Lists: ordered and unordered separately
  html = html.replace(/^\d+\. (.*$)/gim, '<oli>$1</oli>');
  html = html.replace(/^\- (.*$)/gim, '<uli>$1</uli>');
  html = html.replace(/(<oli>.*<\/oli>\n?)+/gim, function(match) { return '<ol>' + match.replace(/<\/?oli>/g, function(t) { return t.replace('oli', 'li'); }) + '</ol>'; });
  html = html.replace(/(<uli>.*<\/uli>\n?)+/gim, function(match) { return '<ul>' + match.replace(/<\/?uli>/g, function(t) { return t.replace('uli', 'li'); }) + '</ul>'; });
  // Convert remaining newlines to <br>, but not inside <pre> blocks
  const parts = html.split(/(<pre>[\s\S]*?<\/pre>)/g);
  html = parts.map((part, i) => i % 2 === 0 ? part.replace(/\n/g, '<br>') : part).join('');
  return html;
}

function renderMarkdown() {
  preview.innerHTML = parseMarkdown(mdInput.value);
}

function copyHtml() {
  copyToClipboard(preview.innerHTML).then(() => showToast(i18n.t('common.copied')));
}
function downloadMd() {
  downloadFile(mdInput.value, 'document.md');
}

mdInput.addEventListener('input', renderMarkdown);
renderMarkdown();


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+shift+c': copyHtml,
  });
}
