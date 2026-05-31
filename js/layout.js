/* ===== 공통 레이아웃 주입 ===== */
(function () {
  function getPrefix() {
    return location.pathname.includes('/tools/') ? '../' : '';
  }

  function getLang() {
    return (typeof i18n !== 'undefined' && i18n.currentLang) || document.documentElement.lang || 'ko';
  }

  function t(key, fallback) {
    if (typeof i18n !== 'undefined' && i18n.t) {
      const val = i18n.t(key);
      if (val !== key) return val;
    }
    return fallback;
  }

  function buildHeader() {
    const p = getPrefix();
    return (
      '<nav>' +
      '<a href="' + p + 'index.html" class="logo">Web<span>Tools</span></a>' +
      '<ul class="nav-links">' +
      '<li><a href="' + p + 'index.html" data-i18n="nav.home">' + t('nav.home', '홈') + '</a></li>' +
      '<li><a href="' + p + 'index.html#tools" data-i18n="nav.tools">' + t('nav.tools', '도구') + '</a></li>' +
      '<li><a href="' + p + 'index.html#about" data-i18n="nav.about">' + t('nav.about', '소개') + '</a></li>' +
      '<li class="lang-switcher">' +
      '<button class="lang-btn active" data-lang="ko" onclick="i18n.switchLang(\'ko\')">KO</button>' +
      '<button class="lang-btn" data-lang="en" onclick="i18n.switchLang(\'en\')">EN</button>' +
      '</li>' +
      '<li><button id="theme-toggle" title="' + t('theme.toggle', '다크모드 전환') + '" data-i18n-aria-label="theme.toggle" aria-label="' + t('theme.toggle', '다크모드 전환') + '">🌙</button></li>' +
      '</ul>' +
      '</nav>'
    );
  }

  function buildFooter() {
    const p = getPrefix();
    return (
      '<div class="footer-content">' +
      '<div class="footer-brand">' +
      '<a href="' + p + 'index.html" class="logo">Web<span>Tools</span></a>' +
      '<p data-i18n="footer.brand_desc">' + t('footer.brand_desc', '설치 없이 바로 쓰는 온라인 개발 도구 모음') + '</p>' +
      '</div>' +
      '<div class="footer-links">' +
      '<a href="' + p + 'tools/json-formatter.html">JSON</a>' +
      '<a href="' + p + 'tools/base64.html">Base64</a>' +
      '<a href="' + p + 'tools/url-encoder.html">URL</a>' +
      '<a href="' + p + 'tools/html-encoder.html">HTML</a>' +
      '<a href="' + p + 'tools/password-generator.html">Password</a>' +
      '<a href="' + p + 'tools/qr-generator.html">QR</a>' +
      '<a href="' + p + 'tools/hash-generator.html">Hash</a>' +
      '<a href="' + p + 'tools/jwt-decoder.html">JWT</a>' +
      '<a href="' + p + 'tools/regex-tester.html">Regex</a>' +
      '<a href="' + p + 'tools/csv-json-converter.html">CSV↔JSON</a>' +
      '<a href="' + p + 'tools/css-formatter.html">CSS</a>' +
      '<a href="' + p + 'tools/markdown-previewer.html">MD</a>' +
      '<a href="' + p + 'tools/px-converter.html">PX</a>' +
      '<a href="' + p + 'tools/image-base64.html">Img64</a>' +
      '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '<p>' +
      '<span data-i18n="footer.copyright">' + t('footer.copyright', '© 2026 WebTools. 온라인 도구 모음.') + '</span>' +
      ' | <a href="' + p + 'sitemap.xml" data-i18n="footer.sitemap">' + t('footer.sitemap', 'Sitemap') + '</a>' +
      ' | <a href="https://github.com/core13773/webtools/issues" target="_blank" rel="noopener noreferrer" data-i18n="feedback.link">' + t('feedback.link', '도구 제안 및 피드백 보내기') + '</a>' +
      '</p>' +
      '</div>'
    );
  }

  function injectLayout() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.innerHTML = buildHeader();
    if (footer) footer.innerHTML = buildFooter();

    // Re-trigger i18n & theme if already loaded
    if (typeof i18n !== 'undefined' && i18n.applyTranslations) {
      i18n.applyTranslations();
    }
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
  } else {
    injectLayout();
  }
})();
