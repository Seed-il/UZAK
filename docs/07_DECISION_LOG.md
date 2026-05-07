# BE-001 Express 서버 초기 세팅

## 결정 내용
- src/backend에 Express 서버 초기 구조를 생성했다.
- 서버 포트는 .env의 PORT 값을 사용한다.
- 기본 확인 API로 GET / 를 사용한다.

## 변경 파일
- src/backend/package.json
- src/backend/.env
- src/backend/.env.example
- src/backend/src/app.js
- src/backend/src/server.js

## 검증 결과
- npm run dev 실행 성공
- GET http://localhost:5000/ JSON 응답 확인
- npm install 결과 0 vulnerabilities

# BE-002 MongoDB 연결

## 결정 내용
- mongoose를 사용하여 MongoDB 연결을 구성했다.
- DB 연결은 서버 시작 시 가장 먼저 수행한다.
- 연결 성공 시 서버를 실행한다.

## 변경 파일
- src/backend/src/config/db.js
- src/backend/src/server.js
- src/backend/.env

## 검증 결과
- MongoDB connected successfully 로그 확인
- 서버 정상 실행 (PORT=5000)
- GET / API 정상 응답

# BE-003 User 모델 구현

## 결정 내용
- mongoose Schema 기반 User 모델 생성
- role enum 제한 적용 (reader, writer)
- timestamps를 created_at, updated_at으로 커스텀

## 추가 개선
- nickname required 추가
- email index 명시
- trim 옵션 적용

# BE-004 회원가입 API 구현

## 결정 내용
- POST /api/auth/register API를 구현했다.
- bcrypt를 사용해 비밀번호를 해시 처리 후 저장한다.
- email, password, nickname, role 필수값 검증을 적용했다.
- email 형식, password 최소 8자, nickname 최소 2자, role enum 검증을 적용했다.
- 중복 email은 409 EMAIL_ALREADY_EXISTS로 처리한다.
- 응답에는 password를 포함하지 않는다.

## 변경 파일
- src/backend/src/controllers/authController.js
- src/backend/src/routes/authRoutes.js
- src/backend/src/app.js
- src/backend/package.json
- src/backend/package-lock.json

## 검증 결과
- 정상 회원가입 성공 확인
- MongoDB users 컬렉션 저장 확인
- password bcrypt 해시 저장 확인
- 중복 email 실패 확인
- 짧은 password 실패 확인
- 잘못된 role 실패 확인

# BE-005 로그인 API 구현

## 결정 내용
- POST /api/auth/login API를 구현했다.
- email, password 필수값 검증을 적용했다.
- bcrypt.compare로 비밀번호를 검증한다.
- 로그인 실패 시 email 존재 여부와 password 오류를 구분하지 않고 INVALID_CREDENTIALS로 응답한다.
- 로그인 성공 시 JWT를 발급한다.
- JWT payload에는 id, email, role을 포함한다.
- JWT 만료 시간은 7d로 설정한다.
- 응답에는 password를 포함하지 않는다.

## 변경 파일
- src/backend/src/controllers/authController.js
- src/backend/src/routes/authRoutes.js
- src/backend/package.json
- src/backend/package-lock.json
- src/backend/.env

## 검증 결과
- 올바른 email/password 로그인 성공 확인
- JWT token 반환 확인
- 잘못된 email 실패 확인
- 잘못된 password 실패 확인
- 필수값 누락 실패 확인
- 로그인 응답에 password 미포함 확인

# BE-006 JWT 인증 미들웨어 구현

## 결정 내용
- JWT 인증 미들웨어를 구현했다.
- Authorization 헤더에서 Bearer 토큰을 읽는다.
- 토큰이 없으면 401 AUTH_REQUIRED로 응답한다.
- Bearer 형식이 잘못되었거나 토큰 검증에 실패하면 401 INVALID_TOKEN으로 응답한다.
- 정상 토큰이면 decoded payload를 req.user에 저장한다.
- register/login 공개 API에는 미들웨어를 적용하지 않는다.

## 변경 파일
- src/backend/src/middlewares/authMiddleware.js

## 검증 결과
- 토큰 없음 실패 확인
- 잘못된 Bearer 형식 실패 확인
- 잘못된 토큰 실패 확인
- 만료 토큰 실패 확인
- 정상 토큰 req.user 설정 확인
- 기존 register/login API 정상 동작 확인

# BE-007 내 정보 조회 API 구현

## 결정 내용
- GET /api/auth/me API를 구현했다.
- BE-006의 authMiddleware를 적용했다.
- req.user.id를 사용해 User를 조회한다.
- 사용자가 없으면 404 USER_NOT_FOUND로 응답한다.
- 응답 user 객체에는 id, email, nickname, role만 포함한다.
- 응답에는 password를 포함하지 않는다.

## 변경 파일
- src/backend/src/controllers/authController.js
- src/backend/src/routes/authRoutes.js

## 검증 결과
- 로그인 후 JWT 발급 확인
- 토큰 없음 시 401 AUTH_REQUIRED 확인
- 잘못된 토큰 시 401 INVALID_TOKEN 확인
- 정상 토큰 사용 시 사용자 정보 반환 확인
- 응답에 password 미포함 확인

# BE-008 Novel 모델 구현

## 결정 내용
- mongoose Schema 기반 Novel 모델을 생성했다.
- title 필드는 필수값으로 설정했다.
- description 필드는 문자열로 설정했다.
- author_id는 ObjectId 타입으로 User 모델을 참조하도록 설정했다.
- is_published는 Boolean 타입이며 기본값 false로 설정했다.
- timestamps 옵션으로 created_at, updated_at을 자동 생성하도록 했다.

## 변경 파일
- src/backend/src/models/Novel.js

## 검증 결과
- Novel 모델 로딩 성공
- author_id가 User 참조(ObjectId)로 설정된 것 확인
- is_published 기본값 false 확인
- created_at, updated_at timestamps 생성 확인
- 기존 register/login/me API 정상 동작 확인

# BE-009 Novel API 구현

## 결정 내용
- POST /api/novels API를 구현했다.
- GET /api/novels API를 구현했다.
- GET /api/novels/:novelId API를 구현했다.
- 작품 생성은 authMiddleware를 적용하여 로그인 사용자만 가능하도록 했다.
- 작품 생성 시 author_id는 클라이언트 입력이 아니라 req.user.id를 사용한다.
- 작품 목록은 is_published: true인 공개 작품만 조회한다.
- 작품 목록은 created_at 기준 최신순으로 정렬한다.
- 작품 상세 조회 시 author 정보를 포함한다.
- 존재하지 않는 작품은 404 NOVEL_NOT_FOUND로 응답한다.

## 변경 파일
- src/backend/src/controllers/novelController.js
- src/backend/src/routes/novelRoutes.js
- src/backend/src/app.js

## 검증 결과
- 로그인 후 작품 생성 성공 확인
- 로그인 없이 작품 생성 시 401 AUTH_REQUIRED 확인
- title 누락 시 400 VALIDATION_ERROR 확인
- 존재하지 않는 작품 조회 시 404 NOVEL_NOT_FOUND 확인
- 기존 auth API 정상 동작 확인

# BE-010 Chapter 모델 및 API 구현

## 결정 내용
- Chapter 모델을 구현했다.
- novel_id는 Novel 모델을 참조한다.
- author_id는 User 모델을 참조한다.
- 같은 novel_id 내 order 중복을 방지하기 위해 unique index를 설정했다.
- POST /api/novels/:novelId/chapters API를 구현했다.
- GET /api/novels/:novelId/chapters API를 구현했다.
- GET /api/chapters/:chapterId API를 구현했다.
- 회차 작성은 로그인한 작품 작성자만 가능하도록 했다.
- 비작성자의 회차 작성은 403 NOT_AUTHOR로 처리한다.

## 변경 파일
- src/backend/src/models/Chapter.js
- src/backend/src/controllers/chapterController.js
- src/backend/src/routes/chapterRoutes.js
- src/backend/src/app.js

## 검증 결과
- 로그인한 작품 작성자 회차 생성 성공 확인
- 로그인 없이 생성 시 401 AUTH_REQUIRED 확인
- 중복 order 시 409 DUPLICATE_CHAPTER_ORDER 확인
- 회차 목록 조회 성공 확인
- 회차 상세 조회 성공 확인
- 없는 작품 조회 시 404 NOVEL_NOT_FOUND 확인
- 없는 회차 조회 시 404 CHAPTER_NOT_FOUND 확인
- 기존 auth/novel API 정상 동작 확인

# FE-001 React 프로젝트 초기 세팅

## 결정 내용
- src/frontend에 Vite 기반 React 프로젝트를 구성했다.
- JavaScript 기반 React를 사용한다.
- React Router와 Axios를 설치했다.
- 기본 페이지로 UZAK 첫 화면을 표시한다.
- 기본 폴더 구조로 pages, components, api를 생성했다.

## 변경 파일
- src/frontend/package.json
- src/frontend/package-lock.json
- src/frontend/index.html
- src/frontend/vite.config.js
- src/frontend/src/main.jsx
- src/frontend/src/App.jsx
- src/frontend/src/pages/HomePage.jsx
- src/frontend/src/api/client.js
- src/frontend/src/styles.css

## 검증 결과
- npm install 성공
- npm run build 성공
- npm run dev 실행 성공
- http://127.0.0.1:5173 접속 성공

# FE-002 API 클라이언트 설정

## 결정 내용
- Axios 인스턴스를 구성했다.
- API base URL은 VITE_API_BASE_URL을 우선 사용하고, 기본값은 http://localhost:5000/api로 설정했다.
- localStorage의 token을 Authorization Bearer 헤더에 자동 첨부하도록 요청 인터셉터를 구성했다.
- 401 응답 시 localStorage token을 제거하도록 응답 인터셉터를 구성했다.
- Auth, Novel, Chapter API 함수를 분리했다.

## 변경 파일
- src/frontend/src/api/client.js
- src/frontend/src/api/authApi.js
- src/frontend/src/api/novelApi.js
- src/frontend/src/api/chapterApi.js

## 검증 결과
- npm run build 성공
- 개발 서버 응답 200 확인
- 첫 화면 정상 표시 확인

# FE-003 라우팅 구조 구현

## 결정 내용
- React Router 기반 라우팅 구조를 구현했다.
- docs/05_UI_FLOW.md 기준 주요 페이지 경로를 생성했다.
- Header 공통 컴포넌트를 생성했다.
- Header에 홈, 작품 목록, 로그인, 회원가입, 작품 작성 링크를 추가했다.
- 각 페이지는 임시 텍스트를 표시하는 상태로 구성했다.

## 변경 파일
- src/frontend/src/App.jsx
- src/frontend/src/components/Header.jsx
- src/frontend/src/pages/HomePage.jsx
- src/frontend/src/pages/LoginPage.jsx
- src/frontend/src/pages/RegisterPage.jsx
- src/frontend/src/pages/NovelListPage.jsx
- src/frontend/src/pages/NovelDetailPage.jsx
- src/frontend/src/pages/ChapterReadPage.jsx
- src/frontend/src/pages/NovelWritePage.jsx
- src/frontend/src/pages/ChapterWritePage.jsx
- src/frontend/src/styles.css

## 검증 결과
- npm run build 성공
- / 경로 접속 성공
- /login 경로 접속 성공
- /register 경로 접속 성공
- /novels 경로 접속 성공
- /novels/:novelId 경로 접속 성공
- /chapters/:chapterId 경로 접속 성공
- /write/novel 경로 접속 성공
- /write/chapter 경로 접속 성공

# FE-004 회원가입 화면 구현

## 결정 내용
- /register 페이지에 회원가입 폼을 구현했다.
- 입력 필드로 email, password, nickname, role을 사용했다.
- password는 보안상 type="password"로 처리했다.
- role 기본값은 reader로 설정했다.
- FE-002에서 구현한 register API를 사용했다.
- 회원가입 성공 시 /login 페이지로 이동하도록 했다.
- 실패 시 에러 메시지를 화면에 표시하도록 했다.

## 변경 파일
- src/frontend/src/pages/RegisterPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 회원가입 성공 시 /login 이동 확인
- 중복 email 시 에러 메시지 표시 확인
- CORS 문제 해결 후 정상 API 호출 확인
- npm run build 성공

# FE-005 로그인 화면 구현

## 결정 내용
- /login 페이지에 로그인 폼을 구현했다.
- 입력 필드로 email, password를 사용했다.
- FE-002의 login API를 사용했다.
- 로그인 성공 시 token을 localStorage에 저장했다.
- 로그인 성공 후 /novels 페이지로 이동하도록 했다.
- 로그인 실패 시 에러 메시지를 표시하도록 했다.
- 요청 중 버튼 비활성화 및 상태 메시지를 표시했다.

## 변경 파일
- src/frontend/src/pages/LoginPage.jsx

## 검증 결과
- 정상 로그인 시 /novels 이동 확인
- localStorage token 저장 확인
- 잘못된 password 입력 시 에러 메시지 표시 확인
- npm run build 성공

# FE-006 작품 목록 화면 구현

## 결정 내용
- /novels 페이지에서 공개 작품 목록을 조회하도록 구현했다.
- FE-002의 getNovels API를 사용했다.
- 페이지 로드 시 작품 목록을 자동으로 불러오도록 구성했다.
- 각 작품을 카드 형태로 표시했다.
- 카드 클릭 시 /novels/:novelId로 이동하도록 구현했다.
- 로딩 상태, 에러 상태, 빈 목록 상태를 각각 처리했다.

## 변경 파일
- src/frontend/src/pages/NovelListPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- /novels 페이지 접속 시 목록 표시 확인
- 카드 클릭 시 상세 페이지 이동 확인
- 로딩 상태 표시 확인
- 백엔드 중단 시 에러 메시지 표시 확인
- npm run build 성공

# FE-007 작품 상세 화면 구현

## 결정 내용
- /novels/:novelId 페이지에서 작품 상세 정보를 조회하도록 구현했다.
- FE-002의 getNovel API를 사용했다.
- FE-002의 getChapters API를 사용해 회차 목록을 함께 조회했다.
- 회차는 order 기준 오름차순으로 정렬하여 표시했다.
- 각 회차 클릭 시 /chapters/:chapterId로 이동하도록 구현했다.
- 로딩 상태 및 에러 상태를 각각 처리했다.

## 변경 파일
- src/frontend/src/pages/NovelDetailPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 작품 상세 정보 표시 확인
- 회차 목록 표시 및 정렬 확인
- 회차 클릭 시 상세 페이지 이동 확인
- 로딩 및 에러 상태 정상 동작 확인
- npm run build 성공

# FE-008 작품 생성 화면 구현

## 결정 내용
- /write/novel 페이지에 작품 생성 폼을 구현했다.
- title, description, is_published 입력을 받는다.
- token이 없으면 /login으로 이동하도록 처리했다.
- FE-002의 createNovel API를 사용했다.
- 작품 생성 성공 시 /novels/:novelId 상세 페이지로 이동한다.
- 요청 중 버튼 비활성화 및 Creating... 상태를 표시한다.

## 변경 파일
- src/frontend/src/pages/NovelWritePage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 로그인 없이 접근 시 /login 이동 확인
- 로그인 후 작품 생성 성공 확인
- 생성 성공 후 상세 페이지 이동 확인
- title 누락 시 에러 메시지 표시 확인
- npm run build 성공

# FE-009 회차 작성 화면 구현

## 결정 내용
- /write/chapter 페이지에 회차 작성 폼을 구현했다.
- novelId는 query 또는 router state에서 받을 수 있도록 했다.
- 로그인하지 않은 사용자는 /login으로 이동하도록 했다.
- FE-002의 createChapter API를 사용했다.
- 회차 작성 성공 시 /novels/:novelId로 이동하도록 했다.
- 요청 중 버튼 비활성화 및 Creating... 상태를 표시했다.

## 변경 파일
- src/frontend/src/pages/ChapterWritePage.jsx
- src/frontend/src/components/Header.jsx

## 검증 결과
- 로그인 후 회차 작성 성공 확인
- 작성 성공 후 작품 상세 페이지 이동 확인
- 로그인 없이 접근 시 /login 이동 확인
- 필드 누락 시 에러 메시지 표시 확인
- npm run build 성공

# FE-010 회차 읽기 화면 구현

## 결정 내용
- /chapters/:chapterId 페이지에서 회차 상세 정보를 조회하도록 구현했다.
- FE-002의 getChapter API를 사용했다.
- 회차 제목, 본문, 생성일을 표시했다.
- 본문 줄바꿈이 유지되도록 스타일을 적용했다.
- chapter의 novel_id를 사용해 작품 상세 페이지로 돌아갈 수 있도록 했다.
- 로딩 및 에러 상태를 처리했다.

## 변경 파일
- src/frontend/src/pages/ChapterReadPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 회차 상세 조회 정상 동작 확인
- 작품 상세 페이지로 돌아가기 동작 확인
- 잘못된 ID 접근 시 에러 메시지 표시 확인
- npm run build 성공

# UI-001, UI-002 Header 로그인 상태 및 로그아웃

## 결정 내용
- Header가 localStorage token 기준으로 로그인 상태를 판단하도록 했다.
- 비로그인 상태에서는 로그인/회원가입 링크를 표시한다.
- 로그인 상태에서는 작품 작성/로그아웃을 표시한다.
- 로그아웃 시 token을 삭제하고 /login으로 이동한다.
- Header를 sticky 및 버튼형 네비게이션 스타일로 개선했다.

## 변경 파일
- src/frontend/src/components/Header.jsx
- src/frontend/src/styles.css

## 검증 결과
- 비로그인 Header 표시 확인
- 로그인 후 Header 상태 변경 확인
- 로그아웃 시 token 삭제 확인
- 로그아웃 후 /login 이동 확인
- npm run build 성공

# UI-003 홈 화면 개선

## 결정 내용
- 홈 화면을 랜딩 페이지 구조로 개선했다.
- Hero Section에 UZAK / 우작, 슬로건, 설명 문구를 추가했다.
- 작품 보러가기 버튼은 /novels로 이동하도록 했다.
- 작품 작성하기 버튼은 로그인 상태에 따라 /login 또는 /write/novel로 이동하도록 했다.
- Feature Section을 카드형 구조로 추가했다.
- 최신 공개 작품 3개를 홈에서 표시하도록 했다.
- 작품 카드 클릭 시 작품 상세 페이지로 이동하도록 했다.

## 변경 파일
- src/frontend/src/pages/HomePage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 홈 랜딩 화면 표시 확인
- 작품 보러가기 버튼 이동 확인
- 작품 작성하기 버튼 로그인 상태별 이동 확인
- 최신 작품 3개 표시 확인
- 작품 카드 클릭 시 상세 페이지 이동 확인
- API 에러 상태 표시 확인
- npm run build 성공

# UI-004 작품 카드 디자인 개선

## 결정 내용
- NovelCard 공통 컴포넌트를 생성했다.
- 홈 최신 작품과 작품 목록에서 같은 NovelCard를 사용하도록 했다.
- 카드에 제목, 설명, 작성자 nickname, 생성일을 표시했다.
- 카드 클릭 시 /novels/:novelId로 이동하도록 했다.
- 설명은 3줄 말줄임 처리했다.
- hover/focus 효과와 카드 그리드 간격을 개선했다.

## 변경 파일
- src/frontend/src/components/NovelCard.jsx
- src/frontend/src/pages/HomePage.jsx
- src/frontend/src/pages/NovelListPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 홈 최신 작품 카드 디자인 확인
- 작품 목록 카드 디자인 통일 확인
- 카드 클릭 시 상세 페이지 이동 확인
- 긴 제목/설명에서도 레이아웃 유지 확인
- npm run build 성공

# UI-005 작품 상세 화면 개선

## 결정 내용
- 작품 상세 헤더를 서비스 상세 페이지 형태로 개선했다.
- 작품 제목, 설명, 작성자, 생성일, 공개 여부를 표시했다.
- 작품 목록으로 돌아가기 버튼을 추가했다.
- 로그인 상태에서만 회차 작성 버튼을 표시하도록 했다.
- 회차 작성 버튼 클릭 시 /write/chapter?novelId=<novelId>로 이동하도록 했다.
- 회차 목록을 카드형 리스트로 개선했다.
- Loading/Error/빈 회차 상태 UI를 개선했다.

## 변경 파일
- src/frontend/src/pages/NovelDetailPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 작품 정보 표시 확인
- 비로그인 상태에서 회차 작성 버튼 숨김 확인
- 로그인 상태에서 회차 작성 버튼 표시 확인
- 회차 작성 버튼 이동 확인
- 회차 클릭 시 읽기 페이지 이동 확인
- 빈 회차 상태 메시지 확인
- npm run build 성공

# UI-006 작성 화면 UX 개선

## 결정 내용
- 작품 생성 및 회차 작성 화면의 UX를 개선했다.
- 입력 폼에 label, placeholder, helper text를 추가했다.
- 제목 글자 수 표시 및 textarea 크기를 개선했다.
- 에러 메시지 스타일과 요청 중 상태를 명확히 했다.
- Cancel 버튼을 추가해 사용자 이탈 흐름을 보완했다.
- 회차 작성 시 novelId 기준으로 적절한 페이지로 이동하도록 처리했다.

## 변경 파일
- src/frontend/src/pages/NovelWritePage.jsx
- src/frontend/src/pages/ChapterWritePage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 작성 화면 UI 개선 확인
- 작품 생성/회차 작성 정상 동작 확인
- Cancel 버튼 이동 확인
- 에러 메시지 및 로딩 상태 확인
- npm run build 성공

# UI-007 공통 상태 컴포넌트

## 결정 내용
- Loading, ErrorMessage, EmptyState 공통 컴포넌트를 생성했다.
- 각 페이지의 로딩/에러/빈 상태 UI를 공통 컴포넌트로 통일했다.
- 중앙 정렬 및 카드형 UI로 사용자 경험을 개선했다.
- 기존 API 호출 로직은 유지하면서 UI만 개선했다.

## 변경 파일
- src/frontend/src/components/Loading.jsx
- src/frontend/src/components/ErrorMessage.jsx
- src/frontend/src/components/EmptyState.jsx
- src/frontend/src/pages/HomePage.jsx
- src/frontend/src/pages/NovelListPage.jsx
- src/frontend/src/pages/NovelDetailPage.jsx
- src/frontend/src/pages/ChapterReadPage.jsx
- src/frontend/src/styles.css

## 검증 결과
- 모든 페이지에서 Loading UI 통일 확인
- 모든 페이지에서 Error UI 통일 확인
- 모든 페이지에서 Empty 상태 UI 통일 확인
- npm run build 성공

# UI-008 반응형 모바일 대응

## 결정 내용
- 1024px 이하 태블릿 대응을 추가했다.
- 768px 이하 모바일 대응을 추가했다.
- 420px 이하 작은 모바일 보정을 추가했다.
- Header, NovelCard, Home, 목록/상세/읽기/작성 화면의 반응형 스타일을 개선했다.
- 모바일에서 버튼과 입력 폼을 터치 친화적으로 조정했다.

## 변경 파일
- src/frontend/src/styles.css

## 검증 결과
- 1024px, 768px, 390px 폭에서 UI 깨짐 없음 확인
- 모바일에서 카드 1열 전환 확인
- Header 줄바꿈 확인
- 작성 폼 input/textarea 폭 정상 확인
- 데스크탑 레이아웃 유지 확인
- npm run build 성공

# DEPLOY-002 GitHub 업로드 준비

## 결정 내용
- README.md를 보완했다.
- backend/frontend 실행 방법을 정리했다.
- 환경변수 설정 방법을 정리했다.
- .gitignore를 통해 .env, node_modules, dist 등을 업로드 제외 대상으로 유지했다.
- GitHub 업로드 명령 예시를 정리했다.

## 변경 파일
- README.md

## 검증 결과
- frontend npm run build 성공
- GitHub 업로드 성공
- .env 및 node_modules 업로드 제외 확인

# DEPLOY-003 MongoDB Atlas 연결

## 결정 내용
- MongoDB Atlas 무료 클러스터를 생성했다.
- backend의 MONGO_URI를 Atlas URI로 변경했다.
- Mongoose 연결 구조가 Atlas에서도 정상 동작함을 확인했다.
- README.md에 Atlas 설정 방법을 정리했다.

## 검증 결과
- MongoDB connected successfully 로그 확인
- Atlas 연결 성공 확인
- backend 서버 정상 실행 확인

# DEPLOY-004 Backend Render 배포

## 결정 내용
- Render Web Service로 백엔드를 배포했다.
- Root Directory는 src/backend로 설정했다.
- Build Command는 npm install을 사용했다.
- Start Command는 npm start를 사용했다.
- MongoDB Atlas URI를 MONGO_URI 환경변수로 설정했다.
- JWT_SECRET을 Render 환경변수로 설정했다.
- Atlas Network Access에서 Render 접속을 허용했다.

## 검증 결과
- MongoDB connected successfully 로그 확인
- UZAK backend server is running on port 10000 로그 확인
- 배포 URL에서 GET / 응답 확인