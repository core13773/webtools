/* ===== 공통 레이아웃 주입 (헤더/푸터/접근성) ===== */
(function () {
  function getPrefix() {
    return location.pathname.includes('/tools/') ? '../' : '';
  }

  function getLang() {
    return (typeof i18n !== 'undefined' && i18n.currentLang) || document.documentElement.lang || 'en';
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
    const menuLabel = t('a11y.menu_toggle', 'Menu');
    return (
      '<a class="skip-link" href="#main-content" data-i18n="a11y.skip">' + t('a11y.skip', 'Skip to content') + '</a>' +
      '<nav>' +
      '<a href="' + p + 'index.html" class="logo">Web<span>Tools</span></a>' +
      '<ul class="nav-links" id="nav-links">' +
      '<li class="nav-page"><a href="' + p + 'index.html" data-i18n="nav.home">' + t('nav.home', 'Home') + '</a></li>' +
      '<li class="nav-page"><a href="' + p + 'index.html#tools" data-i18n="nav.tools">' + t('nav.tools', 'Tools') + '</a></li>' +
      '<li class="nav-page"><a href="' + p + 'index.html#about" data-i18n="nav.about">' + t('nav.about', 'About') + '</a></li>' +
      '<li class="lang-switcher">' +
      '<button class="lang-btn" data-lang="ko">KO</button>' +
      '<button class="lang-btn" data-lang="en">EN</button>' +
      '</li>' +
      '<li><button id="theme-toggle" title="' + t('theme.toggle', 'Toggle dark mode') + '" data-i18n-aria-label="theme.toggle" aria-label="' + t('theme.toggle', 'Toggle dark mode') + '">🌙</button></li>' +
      '</ul>' +
      '<button class="nav-toggle" aria-label="' + menuLabel + '" data-i18n-aria-label="a11y.menu_toggle" aria-expanded="false" aria-controls="nav-links">' +
      '<span class="nav-toggle-bar" aria-hidden="true"></span>' +
      '<span class="nav-toggle-bar" aria-hidden="true"></span>' +
      '<span class="nav-toggle-bar" aria-hidden="true"></span>' +
      '</button>' +
      '</nav>'
    );
  }

  function buildFooter() {
    const p = getPrefix();
    return (
      '<div class="footer-content">' +
      '<div class="footer-brand">' +
      '<a href="' + p + 'index.html" class="logo">Web<span>Tools</span></a>' +
      '<p data-i18n="footer.brand_desc">' + t('footer.brand_desc', 'Free online developer tools — no installation required.') + '</p>' +
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
      '<span data-i18n="footer.copyright">' + t('footer.copyright', '© 2026 WebTools. Online Tool Suite.') + '</span>' +
      ' | <a href="' + p + 'privacy.html" data-i18n="footer.privacy">' + t('footer.privacy', 'Privacy Policy') + '</a>' +
      ' | <a href="' + p + 'terms.html" data-i18n="footer.terms">' + t('footer.terms', 'Terms') + '</a>' +
      ' | <a href="' + p + 'contact.html" data-i18n="footer.contact">' + t('footer.contact', 'Contact') + '</a>' +
      ' | <a href="' + p + 'sitemap.xml" data-i18n="footer.sitemap">' + t('footer.sitemap', 'Sitemap') + '</a>' +
      ' | <a href="mailto:core13773@gmail.com" data-i18n="feedback.email">' + t('feedback.email', '✉️ core13773@gmail.com') + '</a>' +
' | <a href="https://github.com/core13773/webtools/issues" target="_blank" rel="noopener noreferrer" data-i18n="feedback.link">' + t('feedback.link', 'Suggest a tool or send feedback') + '</a>' +
      '</p>' +
      '</div>'
    );
  }

  function setupMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    const close = function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // 링크 클릭 시 메뉴 닫기
    links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    // 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) close();
    });
    // 데스크톱으로 리사이즈 시 닫기
    window.addEventListener('resize', function () { if (window.innerWidth > 640) close(); });
  }

  function setupShortcutHelp() {
    if (document.querySelector('.shortcut-backdrop')) return;
    function row(keys, key, fb) {
      return '<tr><td><kbd>' + keys + '</kbd></td><td data-i18n="' + key + '">' + t(key, fb) + '</td></tr>';
    }
    const backdrop = document.createElement('div');
    backdrop.className = 'shortcut-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'shortcut-title');
    backdrop.innerHTML =
      '<div class="shortcut-modal" tabindex="-1">' +
      '<h2 id="shortcut-title" data-i18n="a11y.shortcut_title">' + t('a11y.shortcut_title', 'Keyboard Shortcuts') + '</h2>' +
      '<table><tbody>' +
      row('Ctrl + K', 'a11y.shortcut_search', 'Focus search box') +
      row('Ctrl + Enter', 'a11y.shortcut_run', 'Run / Convert') +
      row('Ctrl + Shift + C', 'a11y.shortcut_copy', 'Copy result') +
      row('Esc', 'a11y.shortcut_clear', 'Clear') +
      row('?', 'a11y.shortcut_help', 'Show this help') +
      '</tbody></table>' +
      '<button class="btn shortcut-close" data-i18n="a11y.shortcut_close">' + t('a11y.shortcut_close', 'Close') + '</button>' +
      '</div>';
    document.body.appendChild(backdrop);
    var modal = backdrop.querySelector('.shortcut-modal');
    var closeBtn = backdrop.querySelector('.shortcut-close');
    function open() { backdrop.classList.add('open'); modal.focus(); }
    function close() { backdrop.classList.remove('open'); }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    // ? 키로 열기/닫기 (입력창 포커스 중에는 동작 안 함)
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (e.key === '?' && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
        e.preventDefault();
        backdrop.classList.contains('open') ? close() : open();
      } else if (e.key === 'Escape') {
        close();
      }
    });
  }

  function injectLayout() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.innerHTML = buildHeader();
    if (footer) footer.innerHTML = buildFooter();

    // i18n이 이미 로드되어 있으면 다시 적용
    if (typeof i18n !== 'undefined' && i18n.applyTranslations) {
      i18n.applyTranslations();
    }
    // 언어 전환 버튼 이벤트 연결
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof i18n !== 'undefined') i18n.switchLang(btn.dataset.lang);
      });
    });
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // 인라인 스크립트가 설정한 실제 data-theme(시스템 설정 반영)를 읽는다.
      const savedTheme = document.documentElement.getAttribute('data-theme') || 'light';
      themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // 본문에 id 부여 (skip-link 타겟) — 포커스 가능하도록 tabindex 설정
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.setAttribute('tabindex', '-1');

    setupMobileMenu();
    setupShortcutHelp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
  } else {
    injectLayout();
  }
})();
