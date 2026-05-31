const csvInput = document.getElementById('csv-input');
const delimiter = document.getElementById('csv-delimiter');
const hasHeader = document.getElementById('csv-header');
const csvOutput = document.getElementById('csv-output');

function parseCSVLine(line, sep) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = false; }
      } else { current += char; }
    } else {
      if (char === '"') { inQuotes = true; }
      else if (char === sep) { result.push(current); current = ''; }
      else { current += char; }
    }
  }
  result.push(current);
  return result;
}

function escapeCsv(val) {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function csvToJson() {
  const text = csvInput.value.trim();
  if (!text) { showToast(i18n.t('common.enter_text')); return; }
  const sep = delimiter.value || ',';
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) { showToast('빈 데이터입니다'); return; }
  const headers = hasHeader.checked ? parseCSVLine(lines[0], sep) : null;
  const start = hasHeader.checked ? 1 : 0;
  const result = [];
  for (let i = start; i < lines.length; i++) {
    const row = parseCSVLine(lines[i], sep);
    if (headers) {
      const obj = {};
      headers.forEach((h, idx) => obj[h] = row[idx] !== undefined ? row[idx] : '');
      result.push(obj);
    } else {
      result.push(row);
    }
  }
  csvOutput.textContent = JSON.stringify(result, null, 2);
}

function jsonToCsv() {
  const text = csvInput.value.trim();
  if (!text) { showToast(i18n.t('common.enter_text')); return; }
  let data;
  try { data = JSON.parse(text); } catch (e) { showToast(i18n.t('common.error_decoding')); return; }
  if (!Array.isArray(data) || data.length === 0) { showToast('JSON 배열이 필요합니다'); return; }
  const sep = delimiter.value || ',';
  let csv = '';
  if (Array.isArray(data[0])) {
    csv = data.map(row => row.map(escapeCsv).join(sep)).join('\n');
  } else {
    const headers = Object.keys(data[0]);
    csv = headers.map(escapeCsv).join(sep) + '\n';
    csv += data.map(row => headers.map(h => escapeCsv(row[h] !== undefined ? row[h] : '')).join(sep)).join('\n');
  }
  csvOutput.textContent = csv;
}

function copyCsvResult() {
  copyToClipboard(csvOutput.textContent).then(() => showToast(i18n.t('common.copied')));
}
function downloadCsvResult() {
  const ext = hasHeader.checked ? '.json' : '.csv'; // simplistic
  downloadFile(csvOutput.textContent, 'result' + ext);
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': csvToJson,
    'ctrl+shift+c': copyCsvResult,
  });
}