const input = document.getElementById('slug-input');
const output = document.getElementById('slug-output');

// 순수 슬러그 변환 함수 (테스트 가능). 텍스트 → URL 안전 슬러그.
// - NFKD 정규화로 악센트 분해 후 조합 기호 제거 (é -> e)
// - 알파벳/숫자 이외의 연속을 구분자로 치환
// - 앞뒤 구분자 제거
function toSlug(text, sep, lower){
  let s = String(text).normalize('NFKD').replace(/[̀-ͯ]/g, '');
  if(lower) s = s.toLowerCase();
  s = s.replace(/[^a-zA-Z0-9]+/g, sep);
  const esc = sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return s.replace(new RegExp('^' + esc + '+|' + esc + '+$', 'g'), '');
}

function slugify(){
  const text = input.value;
  const sep = document.getElementById('slug-separator').value || '-';
  const lower = document.getElementById('slug-lower').checked;
  output.textContent = toSlug(text, sep, lower);
  output.style.color = 'var(--text)';
}

input.addEventListener('input', slugify);
document.getElementById('slug-separator').addEventListener('change', slugify);
document.getElementById('slug-lower').addEventListener('change', slugify);

function copyResult(){
  copyToClipboard(output.textContent).then(() => showToast(i18n.t('common.copied')));
}

function downloadResult(){
  const content = output.textContent;
  if(!content) return showToast(i18n.t('common.no_result'));
  downloadFile(content, 'slug.txt');
}

function clearAll(){
  input.value = '';
  output.textContent = i18n.t('common.result_placeholder');
  output.style.color = 'var(--text-muted)';
}

slugify();


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+shift+c': copyResult,
    'escape': clearAll,
  });
}
