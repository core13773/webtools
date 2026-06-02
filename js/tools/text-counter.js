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
 const noSpace = text.replace(/\s/g, '');
 const words = text.trim() ? text.trim().split(/\s+/).length : 0;
 const lines = text ? text.split('\n').length : 0;
 const bytes = new Blob([text]).size;
 const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0;
 const stats = [
   i18n.t('common.stats_title'),
   '',
   `${i18n.t('common.stats_chars')}: ${text.length.toLocaleString()}`,
   `${i18n.t('common.stats_chars_no_space')}: ${noSpace.length.toLocaleString()}`,
   `${i18n.t('common.stats_words')}: ${words}`,
   `${i18n.t('common.stats_lines')}: ${lines}`,
   `${i18n.t('common.stats_bytes')}: ${bytes.toLocaleString()}`,
   `${i18n.t('common.stats_sentences')}: ${sentences}`,
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


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+shift+c': copyText,
    'escape': clearText,
  });
}