const patternInput = document.getElementById('regex-pattern');
const flagsInput = document.getElementById('regex-flags');
const testInput = document.getElementById('regex-test');
const replaceInput = document.getElementById('regex-replace');
const resultBox = document.getElementById('regex-result');
const matchesBox = document.getElementById('regex-matches');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function testRegex() {
  const pattern = patternInput.value;
  const flags = flagsInput.value;
  const text = testInput.value;
  if (!pattern) { resultBox.innerHTML = escapeHtml(text); matchesBox.textContent = ''; return; }
  try {
    const re = new RegExp(pattern, flags);
    const matches = [];
    let match;
    if (flags.includes('g')) {
      while ((match = re.exec(text)) !== null) {
        matches.push(match);
        if (match[0] === '') { re.lastIndex++; }
      }
    } else {
      match = re.exec(text);
      if (match) matches.push(match);
    }
    let html = '';
    let lastIndex = 0;
    matches.forEach(m => {
      html += escapeHtml(text.slice(lastIndex, m.index));
      html += '<mark style="background:#fef08a;color:#000;">' + escapeHtml(m[0]) + '</mark>';
      lastIndex = m.index + m[0].length;
    });
    html += escapeHtml(text.slice(lastIndex));
    resultBox.innerHTML = html || escapeHtml(text);
    matchesBox.textContent = matches.map((m, i) => `${i18n.t('tools_regex.match') || 'Match'} ${i + 1}: "${m[0]}" (${i18n.t('tools_regex.index') || 'index'}: ${m.index})`).join('\n') || i18n.t('tools_regex.no_matches');
  } catch (e) {
    resultBox.textContent = '❌ ' + e.message;
    matchesBox.textContent = '';
  }
}

function replaceRegex() {
  const pattern = patternInput.value;
  const flags = flagsInput.value;
  const text = testInput.value;
  const replacement = replaceInput.value;
  if (!pattern) { showToast(i18n.t('tools_regex.error_enter_pattern')); return; }
  try {
    const re = new RegExp(pattern, flags);
    resultBox.innerHTML = escapeHtml(text.replace(re, replacement));
  } catch (e) {
    resultBox.textContent = '❌ ' + e.message;
  }
}

[patternInput, flagsInput, testInput].forEach(el => el && el.addEventListener('input', testRegex));


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': testRegex,
    'escape': clearRegex,
  });
}

function clearRegex(){
  document.getElementById('regex-pattern').value = '';
  document.getElementById('regex-test').value = '';
  document.getElementById('regex-result').innerHTML = '';
  document.getElementById('regex-matches').textContent = '';
}