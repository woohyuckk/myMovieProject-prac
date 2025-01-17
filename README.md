

# 🎞 나만의 영화관


<br/>

## 💬 프로젝트 소개
> 📅 개발 기간 : 2025. 01. 09 ~ 2025. 01. 17 (총 7일)
> <br><br>
> <br> TMDB Open API를 활용해 인기 영화 목록을 불러오고, 검색 기능과 북마크 기능을 통해 원하는 영화를 조회/저장할 수 있습니다.
> **Debouncing** 처리된 검색기능 구현, **LocalStorage** 활용한 북마크 기능 구현, 영화상세내용 모달 구현, 페이지 이동 리모트컨트롤러 구현 


<br>
<br>

## ⚙ 프로젝트 기능 소개
- jQuery 라이브러리 사용 없이 바닐라 자바스크립트로 구성된 프로젝트입니다.
- **TMDB Open API**의 `인기 영화 목록 조회 API` 및 `영화 검색어 조회 API`를 활용했습니다.
- 영화 제목 기반 검색에서 **debounce**를 적용하여 성능 최적화를 했습니다.
- **localStorage**를 이용하여 사용자에게 북마크 기능을 제공합니다.

<br>
<br>

## 📁 프로젝트 구조
```markdown
📁 프로젝트 구조
│
├── 📁 SCRIPT/
│   ├── api.js/
│   ├── utils.js/
|   ├── index.js
│   ├── UI.js
│   
│
│
├── 📁 styles/
│   ├── 📁 fonts/
│   ├── *.css (스타일 파일들)
│
├── index.html
```

## 파일 및 디렉토리 목록
- **index.html**: 프로젝트의 메인 HTML 파일로, UI의 기본 구조를 정의.

- **UI.js**: 사용자 인터페이스와 관련된 JavaScript 파일.
- **API.js**: API 호출 및 데이터 처리와 관련된 JavaScript 파일.
- **index.js** : 메인화면 호출관련된 JavaScript 파일**(미적용)**
- 
- **modal.css**: 모달 창 스타일링을 정의한 CSS 파일.
- **main.css**: 프로젝트의 메인 스타일을 정의한 CSS 파일.
- **header.css** : 프로젝트의 헤더 스타일을 정의한 CSS 파일.

## 상세 설명

### HTML
- **index.html**
  - 프로젝트의 진입점 역할.
  - UI 레이아웃과 모달, 버튼, 섹션 등의 기본 구조 포함.

### JavaScript
- **UI.js**
  - 사용자 인터페이스 동작 구현.
  - 이벤트 리스너, DOM 조작 등 포함.

- **API.js**
  - API 요청 및 데이터 통신 구현.

### CSS
- **modal.css**
  - 모달 창의 레이아웃과 애니메이션 스타일 정의.

- **main.css**
  - 전반적인 스타일 규칙 정의.
  - 페이지의 타이포그래피, 레이아웃, 색상 구성 포함.
