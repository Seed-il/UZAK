# API Specification

## 1. 개요

UZAK MVP는 REST API 방식으로 설계한다.

주요 API 그룹은 다음과 같다.

- Auth API
- User API
- Novel API
- Chapter API

기본 API 주소:

```text
http://localhost:5000/api
````

## 2. 공통 규칙

## 2.1 요청 형식

```http
Content-Type: application/json
```

## 2.2 인증 헤더

로그인이 필요한 API는 다음 헤더를 포함한다.

```http
Authorization: Bearer <token>
```

## 2.3 공통 성공 응답

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {}
}
```

## 2.4 공통 실패 응답

```json
{
  "success": false,
  "message": "에러 메시지",
  "error": "ERROR_CODE"
}
```

---

# 3. Auth API

## 3.1 회원가입

```http
POST /api/auth/register
```

### 설명

새 사용자를 생성한다.

### 인증

필요 없음

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password1234",
  "nickname": "우작작가",
  "role": "writer"
}
```

### Validation

* email: 필수, 이메일 형식, 중복 불가
* password: 필수, 최소 8자 이상
* nickname: 필수, 2자 이상
* role: `"reader"` 또는 `"writer"`

### Success Response

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "test@example.com",
      "nickname": "우작작가",
      "role": "writer"
    }
  }
}
```

---

## 3.2 로그인

```http
POST /api/auth/login
```

### 설명

이메일과 비밀번호로 로그인한다.

### 인증

필요 없음

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password1234"
}
```

### Success Response

```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "test@example.com",
      "nickname": "우작작가",
      "role": "writer"
    }
  }
}
```

---

## 3.3 내 정보 조회

```http
GET /api/auth/me
```

### 설명

현재 로그인한 사용자의 정보를 조회한다.

### 인증

필요

### Success Response

```json
{
  "success": true,
  "message": "내 정보 조회에 성공했습니다.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "test@example.com",
      "nickname": "우작작가",
      "role": "writer"
    }
  }
}
```

---

# 4. Novel API

## 4.1 작품 목록 조회

```http
GET /api/novels
```

### 설명

공개된 작품 목록을 조회한다.

### 인증

필요 없음

### Query Parameters

```text
page=1
limit=10
sort=latest
```

### Success Response

```json
{
  "success": true,
  "message": "작품 목록 조회에 성공했습니다.",
  "data": {
    "novels": [
      {
        "id": "novel_id",
        "title": "첫 번째 작품",
        "description": "작품 설명입니다.",
        "author": {
          "id": "user_id",
          "nickname": "우작작가"
        },
        "is_published": true,
        "created_at": "2026-04-27T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

---

## 4.2 작품 상세 조회

```http
GET /api/novels/:novelId
```

### 설명

작품 상세 정보와 회차 목록을 조회한다.

### 인증

필요 없음

### Success Response

```json
{
  "success": true,
  "message": "작품 상세 조회에 성공했습니다.",
  "data": {
    "novel": {
      "id": "novel_id",
      "title": "첫 번째 작품",
      "description": "작품 설명입니다.",
      "author": {
        "id": "user_id",
        "nickname": "우작작가"
      },
      "is_published": true,
      "created_at": "2026-04-27T00:00:00.000Z",
      "chapters": [
        {
          "id": "chapter_id",
          "title": "1화. 시작",
          "order": 1,
          "created_at": "2026-04-27T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## 4.3 작품 생성

```http
POST /api/novels
```

### 설명

새 작품을 생성한다.

### 인증

필요

### Request Body

```json
{
  "title": "첫 번째 작품",
  "description": "작품 설명입니다.",
  "is_published": true
}
```

### Validation

* title: 필수, 1자 이상
* description: 선택
* is_published: 선택, 기본값 false

### Success Response

```json
{
  "success": true,
  "message": "작품이 생성되었습니다.",
  "data": {
    "novel": {
      "id": "novel_id",
      "title": "첫 번째 작품",
      "description": "작품 설명입니다.",
      "author_id": "user_id",
      "is_published": true,
      "created_at": "2026-04-27T00:00:00.000Z"
    }
  }
}
```

---

## 4.4 작품 수정

```http
PUT /api/novels/:novelId
```

### 설명

본인이 작성한 작품 정보를 수정한다.

### 인증

필요

### 권한

작품 작성자만 가능

### Request Body

```json
{
  "title": "수정된 작품 제목",
  "description": "수정된 작품 설명",
  "is_published": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "작품이 수정되었습니다.",
  "data": {
    "novel": {
      "id": "novel_id",
      "title": "수정된 작품 제목",
      "description": "수정된 작품 설명",
      "author_id": "user_id",
      "is_published": true,
      "updated_at": "2026-04-27T00:00:00.000Z"
    }
  }
}
```

---

## 4.5 작품 삭제

```http
DELETE /api/novels/:novelId
```

### 설명

본인이 작성한 작품을 삭제한다.

### 인증

필요

### 권한

작품 작성자만 가능

### Success Response

```json
{
  "success": true,
  "message": "작품이 삭제되었습니다.",
  "data": null
}
```

---

# 5. Chapter API

## 5.1 회차 목록 조회

```http
GET /api/novels/:novelId/chapters
```

### 설명

특정 작품의 회차 목록을 조회한다.

### 인증

필요 없음

### Success Response

```json
{
  "success": true,
  "message": "회차 목록 조회에 성공했습니다.",
  "data": {
    "chapters": [
      {
        "id": "chapter_id",
        "novel_id": "novel_id",
        "title": "1화. 시작",
        "order": 1,
        "created_at": "2026-04-27T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 5.2 회차 상세 조회

```http
GET /api/chapters/:chapterId
```

### 설명

특정 회차 본문을 조회한다.

### 인증

필요 없음

### Success Response

```json
{
  "success": true,
  "message": "회차 상세 조회에 성공했습니다.",
  "data": {
    "chapter": {
      "id": "chapter_id",
      "novel_id": "novel_id",
      "author_id": "user_id",
      "title": "1화. 시작",
      "content": "본문 내용입니다.",
      "order": 1,
      "created_at": "2026-04-27T00:00:00.000Z"
    }
  }
}
```

---

## 5.3 회차 작성

```http
POST /api/novels/:novelId/chapters
```

### 설명

특정 작품에 새 회차를 작성한다.

### 인증

필요

### 권한

작품 작성자만 가능

### Request Body

```json
{
  "title": "1화. 시작",
  "content": "본문 내용입니다.",
  "order": 1
}
```

### Validation

* title: 필수, 1자 이상
* content: 필수
* order: 필수, 숫자, 같은 작품 내 중복 불가

### Success Response

```json
{
  "success": true,
  "message": "회차가 작성되었습니다.",
  "data": {
    "chapter": {
      "id": "chapter_id",
      "novel_id": "novel_id",
      "author_id": "user_id",
      "title": "1화. 시작",
      "content": "본문 내용입니다.",
      "order": 1,
      "created_at": "2026-04-27T00:00:00.000Z"
    }
  }
}
```

---

## 5.4 회차 수정

```http
PUT /api/chapters/:chapterId
```

### 설명

본인이 작성한 회차를 수정한다.

### 인증

필요

### 권한

회차 작성자만 가능

### Request Body

```json
{
  "title": "수정된 회차 제목",
  "content": "수정된 본문 내용입니다.",
  "order": 1
}
```

### Success Response

```json
{
  "success": true,
  "message": "회차가 수정되었습니다.",
  "data": {
    "chapter": {
      "id": "chapter_id",
      "novel_id": "novel_id",
      "author_id": "user_id",
      "title": "수정된 회차 제목",
      "content": "수정된 본문 내용입니다.",
      "order": 1,
      "updated_at": "2026-04-27T00:00:00.000Z"
    }
  }
}
```

---

## 5.5 회차 삭제

```http
DELETE /api/chapters/:chapterId
```

### 설명

본인이 작성한 회차를 삭제한다.

### 인증

필요

### 권한

회차 작성자만 가능

### Success Response

```json
{
  "success": true,
  "message": "회차가 삭제되었습니다.",
  "data": null
}
```

---

# 6. 주요 에러 코드

## 6.1 인증 관련

```text
AUTH_REQUIRED
INVALID_TOKEN
INVALID_CREDENTIALS
EMAIL_ALREADY_EXISTS
```

## 6.2 권한 관련

```text
FORBIDDEN
NOT_AUTHOR
```

## 6.3 데이터 관련

```text
VALIDATION_ERROR
USER_NOT_FOUND
NOVEL_NOT_FOUND
CHAPTER_NOT_FOUND
DUPLICATE_CHAPTER_ORDER
```

## 6.4 서버 관련

```text
INTERNAL_SERVER_ERROR
```

---

# 7. HTTP 상태 코드 기준

```text
200 OK: 조회/수정/삭제 성공
201 Created: 생성 성공
400 Bad Request: 잘못된 요청
401 Unauthorized: 인증 필요 또는 토큰 오류
403 Forbidden: 권한 없음
404 Not Found: 데이터 없음
409 Conflict: 중복 데이터
500 Internal Server Error: 서버 오류
```

---

# 8. MVP API 구현 순서

```text
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me
4. POST /api/novels
5. GET /api/novels
6. GET /api/novels/:novelId
7. POST /api/novels/:novelId/chapters
8. GET /api/novels/:novelId/chapters
9. GET /api/chapters/:chapterId
10. PUT /api/novels/:novelId
11. PUT /api/chapters/:chapterId
12. DELETE /api/chapters/:chapterId
13. DELETE /api/novels/:novelId
```

---

# 9. API 설계 원칙

* API 응답 형식은 항상 `success`, `message`, `data` 구조를 따른다.
* 비밀번호는 응답에 절대 포함하지 않는다.
* 로그인 필요한 API는 반드시 JWT 인증 미들웨어를 통과해야 한다.
* 수정/삭제 API는 반드시 작성자 권한을 확인한다.
* 작품 목록 조회는 공개된 작품만 반환한다.
* 회차 목록은 `order` 기준 오름차순으로 반환한다.
* MVP 범위를 벗어나는 기능은 구현하지 않는다.