const output = document.getElementById('uuid-output');

function uuidv4(){
 return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
 (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
 );
}

function generate(){
 const n = Math.min(100, Math.max(1, parseInt(document.getElementById('count').value) || 5));
 const arr = [];
 for(let i=0;i<n;i++) arr.push(uuidv4());
 output.textContent = arr.join('\n');
 output.style.color = 'var(--text)';
}

function downloadResult(){
 const content = output.textContent;
 if(!content || content === i18n.t('common.result_placeholder')) return showToast(i18n.t('common.no_uuid'));
 downloadFile(content, 'uuids.txt');
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

generate();
