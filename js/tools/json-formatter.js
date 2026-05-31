const input = document.getElementById('json-input');
const output = document.getElementById('json-output');

function formatJSON(){
 try {
 const raw = input.value.trim();
 if(!raw) return output.textContent = i18n.t('common.enter_json');
 const obj = JSON.parse(raw);
 const sorted = document.getElementById('sort-keys').checked ? sortObject(obj) : obj;
 const space = document.getElementById('compact').checked ? 2 : 4;
 output.textContent = JSON.stringify(sorted, null, space);
 output.style.color = 'var(--text)';
 } catch(e) {
 output.textContent = '❌ 오류: ' + e.message;
 output.style.color = '#ef4444';
 }
}

function minifyJSON(){
 try {
 const raw = input.value.trim();
 if(!raw) return output.textContent = i18n.t('common.enter_json');
 const obj = JSON.parse(raw);
 output.textContent = JSON.stringify(obj);
 output.style.color = 'var(--text)';
 } catch(e) {
 output.textContent = '❌ 오류: ' + e.message;
 output.style.color = '#ef4444';
 }
}

function sortObject(obj){
 if(Array.isArray(obj)) return obj.map(sortObject);
 if(obj !== null && typeof obj === 'object'){
 return Object.keys(obj).sort().reduce((acc,k)=>{acc[k]=sortObject(obj[k]);return acc;},{});
 }
 return obj;
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const content = output.textContent;  if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'formatted.json');
}

function clearAll(){
 input.value = '';  output.textContent = i18n.t('common.result_placeholder');
  output.style.color = 'var(--text-muted)';
}
