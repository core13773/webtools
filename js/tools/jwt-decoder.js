function base64UrlDecode(str) {
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  try { return base64ToUtf8(str); } catch (e) { return null; }
}

function decodeJWT() {
  const input = document.getElementById('jwt-input').value.trim();
  const headerBox = document.getElementById('jwt-header');
  const payloadBox = document.getElementById('jwt-payload');
  const sigBox = document.getElementById('jwt-signature');
  if (!input) { showToast(i18n.t('common.enter_text')); return; }
  const parts = input.split('.');
  if (parts.length !== 3) { showToast(i18n.t('tools_jwt.error_invalid_format')); return; }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]) || '{}');
    const payload = JSON.parse(base64UrlDecode(parts[1]) || '{}');
    headerBox.textContent = JSON.stringify(header, null, 2);
    payloadBox.textContent = JSON.stringify(payload, null, 2);
    sigBox.textContent = parts[2];
  } catch (e) {
    showToast(i18n.t('tools_jwt.error_decoding_prefix') + e.message);
  }
}

function copyHeader() {
  copyToClipboard(document.getElementById('jwt-header').textContent).then(() => showToast(i18n.t('common.copied')));
}
function copyPayload() {
  copyToClipboard(document.getElementById('jwt-payload').textContent).then(() => showToast(i18n.t('common.copied')));
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': decodeJWT,
    'ctrl+shift+c': copyPayload,
  });
}