const input = document.getElementById('text-input');
const output = document.getElementById('text-output');

function encodeBase64(){
 try {
 const text = input.value;
 if(!text) return output.textContent = i18n.t('common.enter_text');
 output.textContent = utf8ToBase64(text);
 output.style.color = 'var(--text)';
 } catch(e) {
 output.textContent = i18n.t('common.error_encoding') + e.message;
 output.style.color = '#ef4444';
 }
}

function decodeBase64(){
 try {
 const text = input.value.trim();
 if(!text) return output.textContent = i18n.t('common.enter_base64');
 output.textContent = base64ToUtf8(text);
 output.style.color = 'var(--text)';
 } catch(e) {
 output.textContent = i18n.t('common.error_decoding');
 output.style.color = '#ef4444';
 }
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const content = output.textContent;  if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'base64-result.txt');
}

function clearAll(){
 input.value = '';  output.textContent = i18n.t('common.result_placeholder');
  output.style.color = 'var(--text-muted)';
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': encodeBase64,
    'ctrl+shift+c': copyResult,
    'escape': clearAll,
  });
}