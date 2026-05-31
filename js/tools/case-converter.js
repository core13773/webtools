const input = document.getElementById('text-input');
const output = document.getElementById('text-output');

function toCase(type){
 const text = input.value;
 if(!text) return output.textContent = i18n.t('common.enter_text');
 let result = '';
 switch(type){
 case 'upper': result = text.toUpperCase(); break;
 case 'lower': result = text.toLowerCase(); break;
 case 'capital': result = text.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase()); break;
 case 'snake': result = text.trim().replace(/\s+/g, '_').toLowerCase(); break;
 case 'camel': result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); break;
 }
 output.textContent = result;
 output.style.color = 'var(--text)';
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const content = output.textContent;
 if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'converted-text.txt');
}

function clearAll(){
 input.value = '';
 output.textContent = i18n.t('common.result_placeholder');
 output.style.color = 'var(--text-muted)';
}
