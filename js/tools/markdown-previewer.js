const mdInput = document.getElementById('md-input');
const preview = document.getElementById('md-preview');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseMarkdown(md) {
  if (!md) return '';
  let html = escapeHtml(md);
  html = html.replace(/```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" style="max-width:100%">');
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>');
  html = html.replace(/\n/gim, '<br>');
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
