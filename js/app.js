// 다크모드 토글 및 저장
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
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

function showToast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--primary); color:#fff; padding:.7rem 1.4rem; border-radius:8px; font-weight:600; z-index:9999; box-shadow:var(--shadow);';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}
