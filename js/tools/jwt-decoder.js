function base64UrlDecode(str) {
  str += new Array(5 - (str.length % 4)).join('=');
  str = str.replace(/\-/g, '+').replace(/\_/g, '/');
  try { return base64ToUtf8(str); } catch (e) { return null; }
}

function decodeJWT() {
  const input = document.getElementById('jwt-input').value.trim();
  const headerBox = document.getElementById('jwt-header');
  const payloadBox = document.getElementById('jwt-payload');
  const sigBox = document.getElementById('jwt-signature');
  if (!input) { showToast(i18n.t('common.enter_text')); return; }
  const parts = input.split('.');
  if (parts.length !== 3) { showToast('❌ 올바른 JWT 형식이 아닙니다'); return; }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]) || '{}');
    const payload = JSON.parse(base64UrlDecode(parts[1]) || '{}');
    headerBox.textContent = JSON.stringify(header, null, 2);
    payloadBox.textContent = JSON.stringify(payload, null, 2);
    sigBox.textContent = parts[2];
  } catch (e) {
    showToast('❌ 디코딩 오류: ' + e.message);
  }
}

function copyHeader() {
  copyToClipboard(document.getElementById('jwt-header').textContent).then(() => showToast(i18n.t('common.copied')));
}
function copyPayload() {
  copyToClipboard(document.getElementById('jwt-payload').textContent).then(() => showToast(i18n.t('common.copied')));
}
