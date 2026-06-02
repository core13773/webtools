// i18n 엔진 - 다국어 지원
const i18n = {
  currentLang: 'ko',
  translations: {},
  callbacks: [],

  async init() {
    const saved = localStorage.getItem('lang');
    if (saved && ['ko', 'en'].includes(saved)) {
      this.currentLang = saved;
    } else {
      const browserLang = navigator.language || navigator.userLanguage || '';
      this.currentLang = browserLang.startsWith('ko') ? 'ko' : 'en';
    }
    await this.loadTranslations();
    this.applyTranslations();
    this.updateLangUI();
    document.documentElement.lang = this.currentLang;
  },

  async loadTranslations() {
    try {
      // Determine base path from page location so fetch works from any page depth
      const prefix = location.pathname.includes('/tools/') ? '../' : '';
      const res = await fetch(`${prefix}i18n/${this.currentLang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.translations = await res.json();
    } catch (e) {
      console.warn('i18n load failed, using defaults:', e);
      this.translations = {};
    }
  },

  t(key) {
    const val = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, this.translations);
    return val !== undefined ? val : key;
  },

  applyTranslations() {
    // data-i18n: textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    // data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
    // data-i18n-value (for input/select/button values)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.tagName === 'BUTTON') {
        el.value = this.t(key);
      }
    });
    // data-i18n-html: innerHTML (for rich content) — sanitized
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = this.t(key);
      // Only allow safe HTML tags; strip script/event handlers
      const sanitized = val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/\son\w+\s*=/gi, ' blocked=');
      el.innerHTML = sanitized;
    });
    // data-i18n-aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      el.setAttribute('aria-label', this.t(key));
    });
    this.callbacks.forEach(fn => fn());
  },

  async switchLang(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    await this.loadTranslations();
    this.applyTranslations();
    this.updateLangUI();
    document.documentElement.lang = lang;
  },

  updateLangUI() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
    // Update theme toggle position
    const switcher = document.querySelector('.lang-switcher');
    if (switcher) {
      switcher.style.order = this.currentLang === 'en' ? '0' : '1';
    }
  },

  onTranslate(fn) {
    this.callbacks.push(fn);
  }
};

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => i18n.init());
