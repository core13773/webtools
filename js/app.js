// 다크모드 토글 및 저장
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

// Note: FOIT prevention is handled by inline script in <head>
if(themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// TextEncoder 기반 Base64 헬퍼 (deprecated escape/unescape 대체)
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// 클립보드 복사 헬퍼
function copyToClipboard(text){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }
}

function downloadFile(content, filename){
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showToast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.setAttribute('role', 'alert');
  el.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--primary); color:#fff; padding:.7rem 1.4rem; border-radius:8px; font-weight:600; z-index:9999; box-shadow:var(--shadow);';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

/* ===== 최근 사용 도구 기록 ===== */
(function recordRecentTool(){
  const path = location.pathname;
  const toolMatch = path.match(/\/tools\/([^/]+)\.html$/);
  if(!toolMatch) return;
  const toolId = toolMatch[1];
  const toolMap = {
    'json-formatter': {title:'JSON 포맷터', titleEn:'JSON Formatter', icon:'📋', tag:'개발', tagEn:'Dev'},
    'base64': {title:'Base64 인코더/디코더', titleEn:'Base64 Encoder/Decoder', icon:'🔐', tag:'개발', tagEn:'Dev'},
    'password-generator': {title:'비밀번호 생성기', titleEn:'Password Generator', icon:'🔑', tag:'보안', tagEn:'Security'},
    'url-encoder': {title:'URL 인코더/디코더', titleEn:'URL Encoder/Decoder', icon:'🌐', tag:'개발', tagEn:'Dev'},
    'text-counter': {title:'글자수 세기', titleEn:'Character Counter', icon:'📝', tag:'문서', tagEn:'Writing'},
    'color-picker': {title:'색상 변환기', titleEn:'Color Converter', icon:'🎨', tag:'디자인', tagEn:'Design'},
    'timestamp-converter': {title:'타임스탬프 변환기', titleEn:'Timestamp Converter', icon:'⏰', tag:'개발', tagEn:'Dev'},
    'html-encoder': {title:'HTML 인코더/디코더', titleEn:'HTML Encoder/Decoder', icon:'📄', tag:'개발', tagEn:'Dev'},
    'qr-generator': {title:'QR 코드 생성기', titleEn:'QR Code Generator', icon:'📱', tag:'유틸리티', tagEn:'Utility'},
    'case-converter': {title:'텍스트 케이스 변환', titleEn:'Text Case Converter', icon:'🔤', tag:'문서', tagEn:'Writing'},
    'uuid-generator': {title:'UUID 생성기', titleEn:'UUID Generator', icon:'🆔', tag:'개발', tagEn:'Dev'},
    'hash-generator': {title:'텍스트 해시 생성기', titleEn:'Hash Generator', icon:'🔒', tag:'보안', tagEn:'Security'},
    'jwt-decoder': {title:'JWT 디코더', titleEn:'JWT Decoder', icon:'🛡️', tag:'보안', tagEn:'Security'},
    'regex-tester': {title:'정규식 테스트기', titleEn:'Regex Tester', icon:'🔍', tag:'개발', tagEn:'Dev'},
    'csv-json-converter': {title:'CSV ↔ JSON 변환기', titleEn:'CSV ↔ JSON Converter', icon:'🔄', tag:'개발', tagEn:'Dev'},
    'css-formatter': {title:'CSS 포맷터', titleEn:'CSS Formatter', icon:'🎨', tag:'디자인', tagEn:'Design'},
    'markdown-previewer': {title:'Markdown 프리뷰어', titleEn:'Markdown Previewer', icon:'📝', tag:'문서', tagEn:'Writing'},
    'px-converter': {title:'PX ↔ REM/EM 변환기', titleEn:'PX ↔ REM/EM Converter', icon:'📐', tag:'디자인', tagEn:'Design'},
    'image-base64': {title:'이미지 Base64 변환', titleEn:'Image to Base64', icon:'🖼️', tag:'유틸리티', tagEn:'Utility'}
  };
  const info = toolMap[toolId];
  if(!info) return;
  const recents = JSON.parse(localStorage.getItem('recentTools') || '[]');
  const filtered = recents.filter(r => r.id !== toolId);
  filtered.unshift({id: toolId, ...info, timestamp: Date.now()});
  localStorage.setItem('recentTools', JSON.stringify(filtered.slice(0, 6)));
})();

/* ===== 오프라인 알림 ===== */
window.addEventListener('offline', () => showToast('⚠️ 오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.'));
window.addEventListener('online', () => showToast('✅ 온라인에 연결되었습니다.'));

/* ===== PWA 설치 배너 ===== */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const banner = document.getElementById('pwa-install-banner');
  if(banner) banner.style.display = 'flex';
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#pwa-install-btn');
  if(!btn || !deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => {
    deferredInstallPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.style.display = 'none';
  });
});

/* ===== 키보드 단축키 ===== */
function setupKeyboardShortcuts(shortcuts) {
  document.addEventListener('keydown', (e) => {
    const parts = [];
    if(e.ctrlKey || e.metaKey) parts.push('ctrl');
    if(e.shiftKey) parts.push('shift');
    if(e.altKey) parts.push('alt');
    parts.push(e.key.toLowerCase());
    const combo = parts.join('+');
    if(shortcuts[combo]) {
      e.preventDefault();
      shortcuts[combo]();
    }
  });
}

// Global shortcuts available on all pages
document.addEventListener('keydown', (e) => {
  const combo = [];
  if(e.ctrlKey || e.metaKey) combo.push('ctrl');
  if(e.shiftKey) combo.push('shift');
  if(e.altKey) combo.push('alt');
  combo.push(e.key.toLowerCase());
  // Ctrl+K: focus search (index page)
  if(combo.join('+') === 'ctrl+k') {
    e.preventDefault();
    const search = document.getElementById('tool-search');
    if(search) search.focus();
  }
});
