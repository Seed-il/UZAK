# Architecture

## 1. 프로젝트 구조

UZAK은 웹소설 읽기와 간단한 연재 기능을 제공하는 웹 서비스다.

초기 MVP는 다음 구조로 개발한다.

```text
Frontend
↓ HTTP API
Backend
↓
Database
````

---

## 2. 전체 아키텍처

```text
[사용자]
   ↓
[Frontend Web App]
   ↓ REST API
[Backend API Server]
   ↓
[Database]
```

---

## 3. 기술 스택

## Frontend

* React
* JavaScript
* CSS
* React Router
* Axios

## Backend

* Node.js
* Express
* JWT 인증
* bcrypt 비밀번호 암호화

## Database

* MongoDB
* Mongoose

---

## 4. 디렉터리 구조

```text
UZAK/
├─ docs/
├─ prompts/
├─ src/
│  ├─ frontend/
│  │  ├─ src/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ api/
│  │  │  └─ App.jsx
│  │  └─ package.json
│  │
│  └─ backend/
│     ├─ src/
│     │  ├─ models/
│     │  ├─ routes/
│     │  ├─ controllers/
│     │  ├─ middlewares/
│     │  ├─ config/
│     │  └─ app.js
│     └─ package.json
```

---

## 5. 핵심 도메인

## User

서비스를 사용하는 회원이다.

역할:

* reader: 일반 독자
* writer: 작품을 작성할 수 있는 작가

주요 기능:

* 회원가입
* 로그인
* 내 정보 조회

---

## Novel

작품 단위이다.

주요 기능:

* 작품 목록 조회
* 작품 상세 조회
* 작품 생성
* 작가별 작품 조회

---

## Chapter

작품에 포함되는 회차 또는 글 단위이다.

주요 기능:

* 회차 목록 조회
* 회차 상세 조회
* 회차 작성
* 회차 수정
* 회차 삭제

---

## 6. 데이터 흐름

## 회원가입

```text
사용자 입력
↓
Frontend 회원가입 폼
↓
POST /api/auth/register
↓
Backend 유효성 검사
↓
비밀번호 bcrypt 암호화
↓
User 저장
↓
회원가입 성공 응답
```

---

## 로그인

```text
사용자 입력
↓
Frontend 로그인 폼
↓
POST /api/auth/login
↓
Backend 이메일/비밀번호 검증
↓
JWT 발급
↓
Frontend token 저장
↓
로그인 상태 유지
```

---

## 작품 목록 조회

```text
사용자 접속
↓
Frontend Home 또는 Category Page
↓
GET /api/novels
↓
Backend Novel 목록 조회
↓
Database 조회
↓
Frontend 작품 목록 표시
```

---

## 작품 상세 조회

```text
사용자 작품 클릭
↓
Frontend Novel Detail Page
↓
GET /api/novels/:novelId
↓
Backend Novel 상세 조회
↓
Frontend 작품 정보 표시
```

---

## 글 작성

```text
작가 로그인
↓
Frontend Chapter Write Page
↓
POST /api/novels/:novelId/chapters
↓
Backend JWT 인증 확인
↓
작성자 권한 확인
↓
Chapter 저장
↓
작성 성공 응답
```

---

## 7. 인증 구조

초기 MVP에서는 JWT 기반 인증을 사용한다.

## 인증 흐름

```text
로그인 성공
↓
JWT 발급
↓
Frontend localStorage에 token 저장
↓
API 요청 시 Authorization Header에 token 포함
↓
Backend에서 token 검증
```

요청 예시:

```http
Authorization: Bearer <token>
```

---

## 8. 권한 정책

## 비로그인 사용자

가능:

* 작품 목록 조회
* 작품 상세 조회
* 회차 읽기

불가능:

* 작품 생성
* 회차 작성
* 회차 수정
* 회차 삭제

---

## 로그인 사용자

가능:

* 작품 목록 조회
* 작품 상세 조회
* 회차 읽기
* 작품 생성
* 본인 작품에 회차 작성

---

## 작성자

가능:

* 본인 작품 수정
* 본인 회차 수정
* 본인 회차 삭제

---

## 관리자

초기 MVP에서는 구현하지 않는다.

향후 확장 기능으로 분리한다.

---

## 9. API 설계 방향

API는 REST 방식으로 설계한다.

## Auth API

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Novel API

```text
GET    /api/novels
GET    /api/novels/:novelId
POST   /api/novels
PUT    /api/novels/:novelId
DELETE /api/novels/:novelId
```

## Chapter API

```text
GET    /api/novels/:novelId/chapters
GET    /api/chapters/:chapterId
POST   /api/novels/:novelId/chapters
PUT    /api/chapters/:chapterId
DELETE /api/chapters/:chapterId
```

---

## 10. Frontend 화면 구조

## 주요 페이지

```text
/
홈 화면

/login
로그인

/register
회원가입

/novels
작품 목록

/novels/:novelId
작품 상세

/novels/:novelId/chapters/:chapterId
회차 읽기

/write/novel
작품 생성

/write/novel/:novelId/chapter
회차 작성
```

---

## 11. Backend 계층 구조

Backend는 다음 계층으로 분리한다.

```text
routes
↓
controllers
↓
models
↓
database
```

## routes

* URL과 HTTP Method를 정의한다.

## controllers

* 요청 처리 로직을 담당한다.

## models

* MongoDB Schema를 정의한다.

## middlewares

* 인증, 에러 처리 등을 담당한다.

---

## 12. 보안 기준

초기 MVP에서 반드시 지킬 것:

* 비밀번호는 평문 저장 금지
* bcrypt로 해시 처리
* JWT Secret은 `.env`에 저장
* MongoDB 접속 정보는 `.env`에 저장
* 로그인 필요한 API는 auth middleware 적용
* 사용자가 다른 작가의 글을 수정/삭제하지 못하게 검사

---

## 13. 환경 변수

Backend `.env` 예시:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/uzak
JWT_SECRET=replace_this_with_secure_secret
```

Frontend `.env` 예시:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 14. 개발 순서

```text
1. Backend 기본 서버 생성
2. MongoDB 연결
3. User 모델 생성
4. Auth API 구현
5. Novel 모델 생성
6. Novel API 구현
7. Chapter 모델 생성
8. Chapter API 구현
9. Frontend 라우팅 구성
10. 로그인/회원가입 UI 구현
11. 작품 목록 UI 구현
12. 작품 상세 UI 구현
13. 회차 작성 UI 구현
14. 통합 테스트
```

---

## 15. MVP 제외 사항

초기 버전에서는 아래 기능을 구현하지 않는다.

* 결제
* 유료 구독
* 피드
* 팔로우
* 관리자 페이지
* 알림
* 댓글
* 좋아요
* 검색 고도화
* 작품 추천 알고리즘

---

## 16. 향후 확장 방향

MVP 이후 다음 순서로 확장한다.

```text
1. 댓글
2. 좋아요
3. 검색
4. 카테고리
5. 팔로우
6. 피드
7. 결제
8. 구독
9. 관리자 페이지
10. 추천 알고리즘
```

---

## 17. AI 역할 분리 기준

이 아키텍처 문서를 기준으로 각 AI는 다음 역할을 수행한다.

## PM AI

* 작업 우선순위 관리
* TASK_BOARD 업데이트
* 범위 초과 기능 차단

## Architect AI

* 구조 변경 검토
* API/DB 설계 일관성 확인

## Backend AI

* Express API 구현
* Mongoose 모델 구현
* 인증/권한 처리

## Frontend AI

* React 화면 구현
* API 연동
* 라우팅 구성

## Tester AI

* 테스트 시나리오 작성
* API 테스트 케이스 작성
* 오류 재현 절차 작성

## Reviewer AI

* 코드 구조 검토
* 보안 문제 검토
* MVP 범위 초과 여부 검토