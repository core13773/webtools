const input = document.getElementById('url-input');
const output = document.getElementById('url-output');

function encodeURL(){
 try {
 const text = input.value;
 if(!text) return output.textContent = i18n.t('common.enter_text');
 output.textContent = encodeURIComponent(text);
 output.style.color = 'var(--text)';
 } catch(e) {
 output.textContent = '❌ 오류: ' + e.message;
 output.style.color = '#ef4444';
 }
}

function decodeURL(){
 try {
 const text = input.value.trim();    if(!text) return output.textContent = i18n.t('common.enter_url_encoded');
 output.textContent = decodeURIComponent(text);
 output.style.color = 'var(--text)';
 } catch(e) {    output.textContent = i18n.t('common.error_decoding');
 output.style.color = '#ef4444';
 }
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const content = output.textContent;  if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'url-result.txt');
}

function clearAll(){
 input.value = '';  output.textContent = i18n.t('common.result_placeholder');
  output.style.color = 'var(--text-muted)';
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': encodeURL,
    'ctrl+shift+c': copyResult,
    'escape': clearAll,
  });
}