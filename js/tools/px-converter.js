const baseInput = document.getElementById('px-base');
const pxInput = document.getElementById('px-value');
const remInput = document.getElementById('rem-value');
const emInput = document.getElementById('em-value');

function stripTrailingZeros(val) {
  return String(parseFloat(val)).replace(/\.$/, '');
}

function updateFromPx() {
  const base = parseFloat(baseInput.value) || 16;
  const px = parseFloat(pxInput.value);
  if (isNaN(px)) return;
  remInput.value = stripTrailingZeros((px / base).toFixed(4));
  emInput.value = stripTrailingZeros((px / base).toFixed(4));
}
function updateFromRem() {
  const base = parseFloat(baseInput.value) || 16;
  const rem = parseFloat(remInput.value);
  if (isNaN(rem)) return;
  pxInput.value = stripTrailingZeros((rem * base).toFixed(2));
  emInput.value = stripTrailingZeros(rem.toFixed(4));
}
function updateFromEm() {
  const base = parseFloat(baseInput.value) || 16;
  const em = parseFloat(emInput.value);
  if (isNaN(em)) return;
  pxInput.value = stripTrailingZeros((em * base).toFixed(2));
  remInput.value = stripTrailingZeros(em.toFixed(4));
}

pxInput.addEventListener('input', updateFromPx);
remInput.addEventListener('input', updateFromRem);
emInput.addEventListener('input', updateFromEm);
baseInput.addEventListener('input', () => { if (pxInput.value) updateFromPx(); });
