# WebTools - 온라인 개발 유틸리티 모음

코딩 없이 시작할 수 있는 광고 수익형 웹앱 템플릿입니다.
GitHub Pages에 무볌무볌으로 호스팅하고, Google AdSense로 수익을 창출할 수 있습니다.

**배포 주소:** https://core13773.github.io/webtools/

---

## 📁 폴터 구조

```
webtools/
├── index.html # 메인 페이지 (12개 도구 목록 + 검색)
├── css/style.css # 공통 디자인 (라이트/다크모드 지원)
├── js/app.js # 공통 기능 (테마, 클립보드, 토스트)
├── sitemap.xml # 검색엔진 사이트맵
├── ads.txt # AdSense 인증 파일
├── robots.txt # 크롤러 접근 허용
├── tools/
│ ├── json-formatter.html # JSON 정렬 및 유효성 검사
│ ├── base64.html # Base64 인코딩/디코딩
│ ├── url-encoder.html # URL 퍼센트 인코딩/디코딩
│ ├── password-generator.html # 강력한 랜덤 비밀번호 생성
│ ├── text-counter.html # 글자수/단어수/바이트 계산
│ ├── color-picker.html # HEX/RGB/HSL 색상 변환
│ ├── timestamp-converter.html# Unix 타임스탬프 ↔ 날짜 변환
│ ├── html-encoder.html # HTML Entity 인코딩/디코딩
│ ├── qr-generator.html # QR 코드 이미지 생성
│ ├── case-converter.html # 대소문자/케이스 변환
│ ├── uuid-generator.html # UUID v4 생성
│ └── hash-generator.html # SHA-256/SHA-1/MD5 해시 생성
└── README.md # 이 파일
```

---

## 🚀 GitHub Pages 배포 방법 (으로)

### 1단계: GitHub에 코드 업로드 (이 저장소)
이 프로젝트는 이미 `core13773/webtools` 저장소에 푸시되어 있습니다.

### 2단계: GitHub Pages 활성화
1. https://github.com/core13773/webtools 에 접속합니다.
2. 상단 메뉴에서 **Settings** 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 항목에서:
 - **Branch**: `main` 선택
 - **Folder**: `/ (root)` 선택
 - **Save** 버튼 클릭
5. 1~2분 후 `https://core13773.github.io/webtools/` 주소가 활성화됩니다.

---

## 💰 Google AdSense 수익화 가이드

### AdSense 가입 및 승인
1. [google.com/adsense](https://www.google.com/adsense) 에 접속하여 가입합니다.
2. **사이트 추가** 단계에서 `https://core13773.github.io/webtools/` 주소를 입력합니다.
3. AdSense에서 제공하는 인증 코드를 `index.html`의 `<head>` 안에 붙여넣습니다.
 ```html
 <head>
 <!-- AdSense 인증 코드 -->
 <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 crossorigin="anonymous"></script>
 ...
 </head>
 ```
4. 변경사항을 Git에 커밋하고 푸시하면 자동으로 배포됩니다.
5. AdSense 검토 기간(보통 며칠~2주)을 기다립니다.

### 광고 삽입 방법
- 각 HTML 파일의 `<!-- Google AdSense 광고 코드를 여기에 붙여넣으세요 -->` 부분을 찾습니다.
- AdSense 대시보드에서 광고 단위를 생성하고 코드를 복사해서 붙여넣으면 됩니다.
- **반응형 광고**를 사용하면 모바일/데스크톱 모두 자동으로 맞춰집니다.

### 광고 배치 팁
- **상단 배너**: 페이지 상단에 배치 (가시성 높음)
- **컨텐츠 내 광고**: 도구 사용 후 스크롤하면 보이는 위치
- 너무 많은 광고는 사용자 경험을 해치니 페이지당 **최대 2개** 권장

---

## 🔍 SEO 트래픽 늘리는 방법

AdSense 수익은 방문자 수와 광고 클릭률에 비례합니다. 트래픽을 늘리는 방법:

1. **키워드 최적화**: 각 도구 페이지의 `<title>`과 `meta name="description"`을 검색 키워드에 맞게 수정하세요.
 - 예: `"JSON 포맷터"` → `"JSON 정렬 프로그램 - 온라인 들여쓰기 도구"`
2. **네이버/구글 웹마스터 등록**:
 - [search.google.com/search-console](https://search.google.com/search-console)
 - [searchadvisor.naver.com](https://searchadvisor.naver.com)
3. **커뮤니티 공유**: OKKY, 디시인사이드 프로그래밍 갤러리, 루리웹 팁 게시판 등에 유용한 도구라고 소개글을 올립시다.
4. **기능 확장**: 방문자가 자주 찾는 도구를 추가하면 재방문율이 높아집니다.

---

## 🛠️ 기능 추가 방법

코딩을 모르셔도 HTML 파일을 **복사해서 수정**하는 방식으로 쉽게 도구를 추가할 수 있습니다.

1. `tools/` 폴터의 기존 파일 하나를 복사하여 새 이름으로 저장합니다.
2. `<title>`, `<h1>`, `meta description`을 새 도구에 맞게 바꿉니다.
3. `<script>` 안의 로직을 새 기능으로 교체합니다.
4. `index.html`의 카드 그리드에 새 도구 링크를 추가합니다.

---

## 📝 라이선스

이 템플릿은 자유롭게 수정 및 상업적 이용이 가능합니다.
AdSense 수익 창출을 위해 마음껏 활용하세요!
