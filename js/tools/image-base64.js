const dropZone = document.getElementById('img-drop-zone');
const fileInput = document.getElementById('img-file-input');
const output = document.getElementById('img-output');
const infoBox = document.getElementById('img-info');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary)'; });
dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border)'; });
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => { if (e.target.files.length) handleFile(e.target.files[0]); });

function handleFile(file) {
  if (!file.type.startsWith('image/')) { showToast(i18n.t('tools_image_base64.error_image_only')); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result;
    output.value = base64;
    infoBox.textContent = `${i18n.t('tools_image_base64.label_name')}: ${file.name} | ${i18n.t('tools_image_base64.label_size')}: ${(file.size / 1024).toFixed(1)} KB | ${i18n.t('tools_image_base64.label_type')}: ${file.type}`;
  };
  reader.readAsDataURL(file);
}

function copyImgBase64() {
  copyToClipboard(output.value).then(() => showToast(i18n.t('common.copied')));
}
function downloadImgBase64() {
  downloadFile(output.value, 'image-base64.txt');
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+shift+c': copyImgBase64,
  });
}