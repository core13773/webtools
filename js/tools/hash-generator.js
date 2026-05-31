const input = document.getElementById('text-input');

// SHA-256 via Web Crypto API
async function sha256(text){
 const encoder = new TextEncoder();
 const data = encoder.encode(text);
 const hashBuffer = await crypto.subtle.digest('SHA-256', data);
 return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// SHA-1 via Web Crypto API
async function sha1(text){
 const encoder = new TextEncoder();
 const data = encoder.encode(text);
 const hashBuffer = await crypto.subtle.digest('SHA-1', data);
 return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// MD5 pure JS implementation (compact)
function md5(text){
 const K = [];
 for(let i=0;i<64;i++) K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296);
 const r=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
 function str2binl(str){
 const bin=[];
 const mask=(1<<8)-1;
 for(let i=0;i<str.length*8;i+=8) bin[i>>5]|=(str.charCodeAt(i/8)&mask)<<(i%32);
 return bin;
 }
 function binl2hex(binarray){
 const hex_tab='0123456789abcdef';
 let str='';
 for(let i=0;i<binarray.length*4;i++) str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);
 return str;
 }
 let x=str2binl(text),a=1732584193,b=-271733879,c=-1732584194,d=271733878;
 x[text.length*8>>5]|=0x80<<(text.length*8%32);x[(((text.length*8+64)>>>9)<<4)+14]=text.length*8;
 for(let i=0;i<x.length;i+=16){
 let olda=a,oldb=b,oldc=c,oldd=d;
 for(let j=0;j<64;j++){
 let f,g;
 if(j<16){f=(b&c)|((~b)&d);g=j;}
 else if(j<32){f=(d&b)|((~d)&c);g=(5*j+1)%16;}
 else if(j<48){f=b^c^d;g=(3*j+5)%16;}
 else{f=c^(b|(~d));g=(7*j)%16;}
 let temp=d;d=c;c=b;b=b+((a+f+K[j]+x[i+g])<<0);a=temp;
 let rot=(b-oldb)<<0;b=oldb+(((rot<<r[j])|(rot>>>(32-r[j])))<<0);
 }
 a=(a+olda)<<0;b=(b+oldb)<<0;c=(c+oldc)<<0;d=(d+oldd)<<0;
 }
 return binl2hex([a,b,c,d]);
}

async function update(){
 const text = input.value;
 document.getElementById('sha256-out').textContent = text ? await sha256(text) : '-';
 document.getElementById('sha1-out').textContent = text ? await sha1(text) : '-';
 document.getElementById('md5-out').textContent = text ? md5(text) : '-';
}

input.addEventListener('input', update);

function downloadResult(){
 const sha256 = document.getElementById('sha256-out').textContent;
 const sha1 = document.getElementById('sha1-out').textContent;
 const md5 = document.getElementById('md5-out').textContent;
 if(sha256 === '-') return showToast(i18n.t('common.no_hash'));
 const content = [
   i18n.t('common.hash_title'),
   '',
   `SHA-256: ${sha256}`,
   `SHA-1:   ${sha1}`,
   `MD5:     ${md5}`,
   '',
   i18n.t('common.hash_input'),
   input.value
 ].join('\n');
 downloadFile(content, 'hash-results.txt');
}

function copyResult(type){
 const el = document.getElementById(type + '-out');
 if(el.textContent === '-') return;
 copyToClipboard(el.textContent).then(()=>showToast(i18n.t('common.copied')));
}


/* ===== 키보드 단축키 ===== */
if(typeof setupKeyboardShortcuts === 'function'){
  setupKeyboardShortcuts({
    'ctrl+shift+c': ()=>copyResult('sha256'),
  });
}