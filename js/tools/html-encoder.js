const input = document.getElementById('text-input');
const output = document.getElementById('text-output');

function encodeHtml(){
 const text = input.value;
 if(!text) return output.textContent = i18n.t('common.enter_text');
 const div = document.createElement('div');
 div.textContent = text;
 output.textContent = div.innerHTML;
 output.style.color = 'var(--text)';
}

function decodeHtml(){
 const text = input.value;
 if(!text) return output.textContent = i18n.t('common.enter_html_entity');
 const div = document.createElement('div');
 div.innerHTML = text;
 output.textContent = div.textContent;
 output.style.color = 'var(--text)';
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const content = output.textContent;
 if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'html-result.txt');
}

function clearAll(){
 input.value = '';
 output.textContent = i18n.t('common.result_placeholder');
 output.style.color = 'var(--text-muted)';
}
