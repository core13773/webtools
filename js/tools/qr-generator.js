// QR Code Generator - Client-side (qrcodejs library)
let currentQRCode = null;

function generateQR() {
  const text = document.getElementById('qr-input').value.trim();
  const resultBox = document.getElementById('qr-result');
  
  if (!text) {
    resultBox.innerHTML = '<p style="color:var(--text-muted);">' + i18n.t('tools_qr.qr_enter_text') + '</p>';
    return;
  }

  // Clear previous QR code
  resultBox.innerHTML = '<div id="qrcode-container"></div><br><a href="#" id="qr-download-link" style="display:inline-block; margin-top:.8rem; color:var(--primary); font-weight:600;" download="qrcode.png"></a>';

  // Generate new QR code using qrcodejs
  const container = document.getElementById('qrcode-container');
  container.innerHTML = '';
  
  currentQRCode = new QRCode(container, {
    text: text,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  // Set up download link
  const downloadLink = document.getElementById('qr-download-link');
  downloadLink.textContent = i18n.t('tools_qr.download_link');
  
  // Wait for canvas to render, then set download
  setTimeout(() => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      downloadLink.href = canvas.toDataURL('image/png');
    }
  }, 100);

  // Show privacy notice
  const notice = document.createElement('div');
  notice.style.cssText = 'margin-top:.5rem; font-size:.8rem; color:var(--text-muted);';
  notice.textContent = i18n.t('tools_qr.api_notice');
  resultBox.appendChild(notice);
}

function downloadResult() {
  const text = document.getElementById('qr-input').value.trim();
  if (!text) {
    showToast(i18n.t('common.no_qr_text'));
    return;
  }
  downloadFile(text, 'qr-content.txt');
}

function clearAll() {
  document.getElementById('qr-input').value = '';
  const resultBox = document.getElementById('qr-result');
  resultBox.innerHTML = '<p style="color:var(--text-muted);">' + i18n.t('tools_qr.qr_placeholder') + '</p>';
  currentQRCode = null;
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': generateQR,
    'escape': clearAll,
  });
}