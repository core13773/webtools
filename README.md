# WebTools - Online Developer Tools / 온라인 개발 유틸리티 모음

A collection of 19 free online developer tools that run entirely in your browser. No installation, no sign-up, no data sent to any server.
설치 없이 바로 쓰는 19가지 온라인 개발 도구 모음입니다. 모든 처리는 브라우저에서 이루어집니다.

**Live Site / 배포 주소:** https://core13773.github.io/webtools/

---

## 📁 Project Structure / 폴더 구조

```
webtools/
├── index.html                 # Main page / 메인 페이지 (19 tools + search)
├── 404.html                   # 404 error page / 오류 페이지
├── css/style.css              # Common styles / 공통 디자인 (light/dark mode)
├── css/tools.css              # Tool-specific styles / 도구별 스타일
├── js/app.js                  # Shared utils / 공통 기능 (theme, clipboard, toast)
├── js/i18n.js                 # i18n engine / 다국어(i18n) 엔진
├── js/layout.js               # Common layout injection / 공통 레이아웃 주입
├── js/tools/                  # Tool JavaScript files / 도구별 JavaScript
├── i18n/ko.json               # Korean translations / 한국어 번역
├── i18n/en.json               # English translations / 영어 번역
├── sitemap.xml                # Search engine sitemap / 검색엔진 사이트맵
├── robots.txt                 # Crawler access rules / 크롤러 접근 허용
├── manifest.json              # PWA manifest / PWA 매니페스트
├── sw.js                      # Service Worker (offline support) / 오프라인 지원
└── tools/
    ├── json-formatter.html    # JSON Formatter & Validator
    ├── base64.html            # Base64 Encoder/Decoder
    ├── url-encoder.html       # URL Percent Encoder/Decoder
    ├── password-generator.html # Strong Random Password Generator
    ├── text-counter.html      # Character/Word/Byte Counter
    ├── color-picker.html      # HEX/RGB/HSL Color Converter
    ├── timestamp-converter.html # Unix Timestamp ↔ Date Converter
    ├── html-encoder.html      # HTML Entity Encoder/Decoder
    ├── qr-generator.html      # QR Code Image Generator
    ├── case-converter.html    # Text Case Converter
    ├── uuid-generator.html    # UUID v4 Generator
    ├── hash-generator.html    # SHA-256/SHA-1/MD5 Hash Generator
    ├── jwt-decoder.html       # JWT Token Decoder
    ├── regex-tester.html      # Regex Pattern Tester
    ├── csv-json-converter.html # CSV ↔ JSON Converter
    ├── css-formatter.html     # CSS Formatter & Minifier
    ├── markdown-previewer.html # Markdown Live Previewer
    ├── px-converter.html      # PX ↔ REM/EM Converter
    └── image-base64.html      # Image to Base64 Encoder
```

---

## 🚀 GitHub Pages Deployment / 배포 방법

### Step 1 / 1단계: Push to GitHub / GitHub에 푸시
This project is already available at `core13773/webtools`.
이 프로젝트는 `core13773/webtools` 저장소에 푸시되어 있습니다.

### Step 2 / 2단계: Enable GitHub Pages / GitHub Pages 활성화
1. Go to https://github.com/core13773/webtools / 저장소에 접속합니다.
2. Click **Settings** at the top / 상단 메뉴에서 **Settings** 클릭
3. Click **Pages** in the left menu / 왼쪽 메뉴에서 **Pages** 클릭
4. Under **Source** / **Source** 항목에서:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
   - Click **Save** / **Save** 버튼 클릭
5. After 1-2 minutes / 1~2분 후: `https://core13773.github.io/webtools/` is live / 활성화됩니다.

---

## 🛠️ How to Add a New Tool / 기능 추가 방법

You can add tools even without coding experience by copying and modifying an existing HTML file.
코딩을 모르셔도 HTML 파일을 복사해서 수정하는 방식으로 쉽게 도구를 추가할 수 있습니다.

1. Copy an existing file from `tools/` and save with a new name / `tools/` 폴더의 기존 파일 하나를 복사하여 새 이름으로 저장합니다.
2. Update `<title>`, `<h1>`, `meta description` for the new tool / `<title>`, `<h1>`, `meta description`을 새 도구에 맞게 바꿉니다.
3. Replace the logic in the `<script>` section with the new functionality / `<script>` 안의 로직을 새 기능으로 교체합니다.
4. Add a new card link in `index.html`'s card grid / `index.html`의 카드 그리드에 새 도구 링크를 추가합니다.
5. Add i18n translations in `i18n/en.json` and `i18n/ko.json` / `i18n/en.json`과 `i18n/ko.json`에 번역을 추가합니다.

---

## 🔍 SEO & Traffic Tips / SEO 및 트래픽 가이드

1. **Keywords / 키워드 최적화**: Each tool page has optimized `<title>` and `meta description` tags / 각 도구 페이지의 `<title>`과 `meta description`이 최적화되어 있습니다.
2. **Search Console / 웹마스터 등록**: Register with [Google Search Console](https://search.google.com/search-console) and [Naver Search Advisor](https://searchadvisor.naver.com).
3. **Community Sharing / 커뮤니티 공유**: Share useful tools on developer communities to increase organic traffic / 유용한 도구를 개발자 커뮤니티에 공유하세요.

---

## 📝 License / 라이선스

This template is free to modify and use for commercial purposes.
이 템플릿은 자유롭게 수정 및 상업적 이용이 가능합니다.
