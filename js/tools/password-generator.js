const output = document.getElementById('pwd-output');
const strength = document.getElementById('strength');

const CHARS = {
 upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
 lower: 'abcdefghijklmnopqrstuvwxyz',
 number: '0123456789',
 symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function generate(){
 const len = parseInt(document.getElementById('length').value);
 const pools = [];
 if(document.getElementById('use-upper').checked) pools.push(CHARS.upper);
 if(document.getElementById('use-lower').checked) pools.push(CHARS.lower);
 if(document.getElementById('use-number').checked) pools.push(CHARS.number);
 if(document.getElementById('use-symbol').checked) pools.push(CHARS.symbol);

 if(pools.length === 0){  output.textContent = i18n.t('common.select_charset');
 output.style.color = '#ef4444';
 strength.textContent = '';
 return;
 }

 const all = pools.join('');
 let pwd = '';
 const cryptoObj = window.crypto || window.msCrypto;
 const arr = new Uint32Array(len);
 cryptoObj.getRandomValues(arr);

 for(let i=0;i<len;i++){
 pwd += all[arr[i] % all.length];
 }

 output.textContent = pwd;
 output.style.color = 'var(--text)';
 evaluateStrength(pwd);
}

function evaluateStrength(pwd){
 let score = 0;
 if(pwd.length >= 12) score++;
 if(pwd.length >= 20) score++;
 if(/[A-Z]/.test(pwd)) score++;
 if(/[a-z]/.test(pwd)) score++;
 if(/[0-9]/.test(pwd)) score++;
 if(/[^A-Za-z0-9]/.test(pwd)) score++;

 const labels = [i18n.t('common.strength_very_weak'), i18n.t('common.strength_weak'), i18n.t('common.strength_normal'), i18n.t('common.strength_strong'), i18n.t('common.strength_very_strong')];
 const colors = ['#ef4444','#f97316','#eab308','#22c55e','#10b981'];
 const idx = Math.min(4, Math.floor(score/1.2));
 strength.textContent = i18n.t('common.strength_label') + ' ' + labels[idx];
 strength.style.color = colors[idx];
}

function downloadResult(){    const pwd = output.textContent;  if(!pwd || pwd === i18n.t('common.generate_password_placeholder') || pwd === i18n.t('common.select_charset')) return showToast(i18n.t('common.no_password'));
 downloadFile(pwd, 'password.txt');
}

function copyResult(){
 copyToClipboard(output.textContent).then(()=>showToast(i18n.t('common.copied')));
}

// 페이지 로드 시 자동 생성
generate();


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': generate,
    'ctrl+shift+c': copyResult,
  });
}