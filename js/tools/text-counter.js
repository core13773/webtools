const input = document.getElementById('text-input');

function updateStats(){
 const text = input.value;
 const noSpace = text.replace(/\s/g, '');
 const words = text.trim() ? text.trim().split(/\s+/).length : 0;
 const lines = text ? text.split('\n').length : 0;
 const bytes = new Blob([text]).size;
 const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0;

 document.getElementById('stat-chars').textContent = text.length.toLocaleString();
 document.getElementById('stat-chars-no-space').textContent = noSpace.length.toLocaleString();
 document.getElementById('stat-words').textContent = words.toLocaleString();
 document.getElementById('stat-lines').textContent = lines.toLocaleString();
 document.getElementById('stat-bytes').textContent = bytes.toLocaleString();
 document.getElementById('stat-sentences').textContent = sentences.toLocaleString();
}

input.addEventListener('input', updateStats);

function copyText(){
 copyToClipboard(input.value).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const text = input.value;
 const stats = [
   i18n.t('common.stats_title'),
   '',
   `${i18n.t('common.stats_chars')}: ${text.length.toLocaleString()}`,
   `${i18n.t('common.stats_chars_no_space')}: ${text.replace(/\s/g, '').length.toLocaleString()}`,
   `${i18n.t('common.stats_words')}: ${text.trim() ? text.trim().split(/\s+/).length : 0}`,
   `${i18n.t('common.stats_lines')}: ${text ? text.split('\n').length : 0}`,
   `${i18n.t('common.stats_bytes')}: ${new Blob([text]).size.toLocaleString()}`,
   `${i18n.t('common.stats_sentences')}: ${text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0}`,
   '',
   i18n.t('common.stats_input_text'),
   text
 ].join('\n');
 downloadFile(stats, 'text-stats.txt');
}

function clearText(){
 input.value = '';
 updateStats();
}
