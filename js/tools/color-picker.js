const picker = document.getElementById('color-picker');
const hexInput = document.getElementById('hex-input');
const rgbOut = document.getElementById('rgb-output');
const hslOut = document.getElementById('hsl-output');
const preview = document.getElementById('color-preview');

function hexToRgb(hex){
 const r = parseInt(hex.slice(1,3),16);
 const g = parseInt(hex.slice(3,5),16);
 const b = parseInt(hex.slice(5,7),16);
 return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex){
 let r = parseInt(hex.slice(1,3),16)/255;
 let g = parseInt(hex.slice(3,5),16)/255;
 let b = parseInt(hex.slice(5,7),16)/255;
 const max = Math.max(r,g,b), min = Math.min(r,g,b);
 let h=0,s=0,l=(max+min)/2;
 if(max!==min){
 const d = max-min;
 s = l>0.5?d/(2-max-min):d/(max+min);
 switch(max){
 case r: h=(g-b)/d+(g<b?6:0); break;
 case g: h=(b-r)/d+2; break;
 case b: h=(r-g)/d+4; break;
 }
 h/=6;
 }
 return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}

function update(hex){
 if(!/^#[0-9A-Fa-f]{6}$/.test(hex)){
  rgbOut.value = '';
  hslOut.value = '';
  preview.style.background = 'var(--bg)';
  return;
 }
 rgbOut.value = hexToRgb(hex);
 hslOut.value = hexToHsl(hex);
 preview.style.background = hex;
}

picker.addEventListener('input', (e)=>{
 hexInput.value = e.target.value;
 update(e.target.value);
});

hexInput.addEventListener('input', (e)=>{
 let v = e.target.value;
 if(v.length===7){
 picker.value = v;
 update(v);
 }
});

function randomColor(){
 const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
 picker.value = hex;
 hexInput.value = hex;
 update(hex);
}

function copyAll(){
 const text = `HEX: ${hexInput.value}\nRGB: ${rgbOut.value}\nHSL: ${hslOut.value}`;
 copyToClipboard(text).then(()=>showToast(i18n.t('common.copied')));
}

function downloadResult(){
 const text = `HEX: ${hexInput.value}\nRGB: ${rgbOut.value}\nHSL: ${hslOut.value}`;
 if(!rgbOut.value) return showToast(i18n.t('common.no_color'));
 downloadFile(text, 'color-values.txt');
}

function copySingle(el){
 copyToClipboard(el.value).then(()=>showToast(i18n.t('common.copied')));
}

update('#4f46e5');
