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

// MD5 pure JS implementation — UTF-8 입력을 올바르게 처리하는 표준 구현 (RFC 1321)
function md5(text){
 const bytes = Array.from(new TextEncoder().encode(text));
 const K = [];
 for(let i=0;i<64;i++) K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296);
 const s=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
 const bitLen = bytes.length * 8;
 bytes.push(0x80);
 while(bytes.length % 64 !== 56) bytes.push(0);
 // 메시지 길이(비트)를 64비트 리틀엔디언으로 추가. (>>> 32 는 0이 아니므로 상위 4바이트는 명시적으로 0)
 bytes.push(bitLen & 0xff, (bitLen >>> 8) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 24) & 0xff, 0, 0, 0, 0);
 function rol(x,c){ x>>>=0; return ((x<<c)|(x>>>(32-c)))>>>0; }
 let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
 for(let off=0;off<bytes.length;off+=64){
  const M=new Array(16);
  for(let i=0;i<16;i++) M[i]=(bytes[off+i*4]|(bytes[off+i*4+1]<<8)|(bytes[off+i*4+2]<<16)|(bytes[off+i*4+3]<<24))>>>0;
  let A=a0,B=b0,C=c0,D=d0;
  for(let i=0;i<64;i++){
   let f,g;
   if(i<16){f=(B&C)|(~B&D);g=i;}
   else if(i<32){f=(D&B)|(~D&C);g=(5*i+1)%16;}
   else if(i<48){f=B^C^D;g=(3*i+5)%16;}
   else{f=C^(B|~D);g=(7*i)%16;}
   f=(f+A+K[i]+M[g])>>>0;
   A=D;D=C;C=B;
   B=(B+rol(f,s[i]))>>>0;
  }
  a0=(a0+A)>>>0;b0=(b0+B)>>>0;c0=(c0+C)>>>0;d0=(d0+D)>>>0;
 }
 const leHex=v=>[0,8,16,24].map(sh=>((v>>>sh)&0xff).toString(16).padStart(2,'0')).join('');
 return leHex(a0)+leHex(b0)+leHex(c0)+leHex(d0);
}

async function update(){
 const text = input.value;
 document.getElementById('sha256-out').textContent = text ? await sha256(text) : '-';
 document.getElementById('sha1-out').textContent = text ? await sha1(text) : '-';
 document.getElementById('md5-out').textContent = text ? md5(text) : '-';
}

input.addEventListener('input', update);

function downloadResult(){
 const sha256Val = document.getElementById('sha256-out').textContent;
 const sha1Val = document.getElementById('sha1-out').textContent;
 const md5Val = document.getElementById('md5-out').textContent;
 if(sha256Val === '-') return showToast(i18n.t('common.no_hash'));
 const content = [
   i18n.t('common.hash_title'),
   '',
   `SHA-256: ${sha256Val}`,
   `SHA-1:   ${sha1Val}`,
   `MD5:     ${md5Val}`,
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