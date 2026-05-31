const tsInput = document.getElementById('ts-input');
const tsOutput = document.getElementById('ts-output');

function updateCurrent(){
 const now = Date.now();
 document.getElementById('current-ts').textContent = Math.floor(now/1000);
 document.getElementById('current-date').textContent = new Date().toLocaleString(i18n.currentLang === 'ko' ? 'ko-KR' : 'en-US');
}

setInterval(updateCurrent, 1000);
updateCurrent();

function convertTs(){
 const v = tsInput.value.trim();
 if(!v) return tsOutput.textContent = i18n.t('common.enter_timestamp');
 let ms = parseInt(v);
 if(isNaN(ms)) return tsOutput.textContent = i18n.t('common.enter_number');
 if(v.length <= 10) ms *= 1000; // 초 단위

 const d = new Date(ms);
 if(isNaN(d.getTime())) return tsOutput.textContent = i18n.t('common.error_invalid_ts');

 const locale = i18n.currentLang === 'ko' ? 'ko-KR' : 'en-US';
 const lines = [
 `${i18n.t('common.ts_local')}: ${d.toLocaleString(locale)}`,
 `${i18n.t('common.ts_utc')}: ${d.toUTCString()}`,
 `${i18n.t('common.ts_iso')}: ${d.toISOString()}`,
 ``,
 `${i18n.t('common.ts_seconds')}: ${Math.floor(ms/1000)}`,
 `${i18n.t('common.ts_milliseconds')}: ${ms}`,
 ];
 tsOutput.textContent = lines.join('\n');
 tsOutput.style.color = 'var(--text)';
}

function useNow(){
 tsInput.value = Math.floor(Date.now()/1000);
 convertTs();
}

function downloadResult(){
 const content = tsOutput.textContent;
 if(!content || content === i18n.t('common.result_placeholder') || content.startsWith('❌')) return showToast(i18n.t('common.no_result'));
 downloadFile(content, 'timestamp-result.txt');
}

function copyResult(){
 copyToClipboard(tsOutput.textContent).then(()=>showToast(i18n.t('common.copied')));
}
