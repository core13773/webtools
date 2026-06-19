const csvInput = document.getElementById('csv-input');
const delimiter = document.getElementById('csv-delimiter');
const hasHeader = document.getElementById('csv-header');
const csvOutput = document.getElementById('csv-output');

let lastConversionType = 'csv'; // Track which conversion was last run

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

function escapeCsv(val, sep) {
  const str = String(val);
  if (str.includes(sep) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// HTML <option value="\t">는 리터럴 백슬래시+t 2글자로 전달되므로 실제 탭으로 변환.
// 순수 함수로 만들어 테스트가 가능하도록 원시 선택값(rawValue)을 인자로 받습니다.
function getSep(rawValue) {
  const v = rawValue;
  return v === '\\t' ? '\t' : (v || ',');
}

function csvToJson() {
  lastConversionType = 'json';
  const text = csvInput.value.trim();
  if (!text) { showToast(i18n.t('common.enter_text')); return; }
  const sep = getSep(delimiter.value);
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) { showToast(i18n.t('tools_csv_json.error_empty_data')); return; }
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
  lastConversionType = 'csv';
  const text = csvInput.value.trim();
  if (!text) { showToast(i18n.t('common.enter_text')); return; }
  let data;
  try { data = JSON.parse(text); } catch (e) { showToast(i18n.t('common.error_decoding')); return; }
  if (!Array.isArray(data) || data.length === 0) { showToast(i18n.t('tools_csv_json.error_json_array_required')); return; }
  const sep = getSep(delimiter.value);
  let csv = '';
  if (Array.isArray(data[0])) {
    csv = data.map(row => row.map(v => escapeCsv(v, sep)).join(sep)).join('\n');
  } else {
    const allKeys = [...new Set(data.flatMap(obj => Object.keys(obj)))];
    csv = allKeys.map(k => escapeCsv(k, sep)).join(sep) + '\n';
    csv += data.map(row => allKeys.map(h => escapeCsv(row[h] !== undefined ? row[h] : '', sep)).join(sep)).join('\n');
  }
  csvOutput.textContent = csv;
}

function copyCsvResult() {
  copyToClipboard(csvOutput.textContent).then(() => showToast(i18n.t('common.copied')));
}
function downloadCsvResult() {
  const ext = lastConversionType === 'json' ? '.json' : '.csv';
  downloadFile(csvOutput.textContent, 'result' + ext);
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+enter': csvToJson,
    'ctrl+shift+c': copyCsvResult,
  });
}
