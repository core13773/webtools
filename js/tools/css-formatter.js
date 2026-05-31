const cssInput = document.getElementById('css-input');
const indentSel = document.getElementById('css-indent');
const cssOutput = document.getElementById('css-output');

function formatCSS() {
  const css = cssInput.value;
  const indent = indentSel.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSel.value));
  let formatted = '';
  let depth = 0;
  const tokens = css.match(/[^{}]+|\{|\}/g) || [];
  tokens.forEach(tok => {
    tok = tok.trim();
    if (!tok) return;
    if (tok === '{') {
      formatted += ' {\n';
      depth++;
    } else if (tok === '}') {
      depth = Math.max(0, depth - 1);
      formatted += indent.repeat(depth) + '}\n';
    } else {
      const props = tok.split(';').filter(p => p.trim());
      if (props.length > 1) {
        formatted += indent.repeat(depth) + props.map(p => p.trim()).join(';\n' + indent.repeat(depth)) + ';\n';
      } else {
        formatted += indent.repeat(depth) + tok + '\n';
      }
    }
  });
  cssOutput.textContent = formatted.trim();
}

function minifyCSS() {
  const css = cssInput.value;
  cssOutput.textContent = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\}:;,])\s*/g, '$1')
    .replace(/;\s*\}/g, '}')
    .trim();
}

function copyCssResult() {
  copyToClipboard(cssOutput.textContent).then(() => showToast(i18n.t('common.copied')));
}
