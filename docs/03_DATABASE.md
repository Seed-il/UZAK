# Database Design

## 1. 개요

UZAK 서비스는 MongoDB 기반으로 설계한다.

초기 MVP에서는 다음 3개의 핵심 컬렉션을 사용한다:

- User
- Novel
- Chapter

---

## 2. 데이터베이스 선택 이유

MongoDB를 사용하는 이유:

- 빠른 개발 속도
- 유연한 스키마 구조
- JavaScript(Node.js)와 자연스러운 연동
- 초기 MVP에 적합

---

## 3. 컬렉션 구조

---

## 3.1 User Collection

### 설명
서비스 사용자 정보를 저장한다.

### 스키마

```js
User {
  _id: ObjectId,
  email: String,           // 로그인 이메일 (unique)
  password: String,        // bcrypt 해시된 비밀번호
  nickname: String,        // 사용자 닉네임
  role: String,            // "reader" | "writer"
  created_at: Date,
  updated_at: Date
}
````

### 인덱스

```text
- email (unique)
```

---

## 3.2 Novel Collection

### 설명

작품 정보를 저장한다.

### 스키마

```js
Novel {
  _id: ObjectId,
  title: String,           // 작품 제목
  description: String,     // 작품 설명
  author_id: ObjectId,     // User 참조
  is_published: Boolean,   // 공개 여부
  created_at: Date,
  updated_at: Date
}
```

### 인덱스

```text
- author_id
- created_at
```

---

## 3.3 Chapter Collection

### 설명

작품의 회차(글)를 저장한다.

### 스키마

```js
Chapter {
  _id: ObjectId,
  novel_id: ObjectId,      // Novel 참조
  author_id: ObjectId,     // 작성자 (User 참조)
  title: String,           // 회차 제목
  content: String,         // 본문 내용
  order: Number,           // 회차 순서
  created_at: Date,
  updated_at: Date
}
```

### 인덱스

```text
- novel_id
- order
```

---

## 4. 컬렉션 관계

```text
User 1 : N Novel
User 1 : N Chapter
Novel 1 : N Chapter
```

설명:

* 한 명의 User는 여러 개의 Novel을 작성할 수 있다.
* 한 개의 Novel은 여러 개의 Chapter를 가진다.
* Chapter는 반드시 하나의 Novel에 속한다.

---

## 5. 데이터 흐름 기준 설계

---

## 작품 목록 조회

```text
Novel Collection 조회
→ 최신순 / 인기순 정렬
→ 리스트 반환
```

---

## 작품 상세 조회

```text
Novel 조회
+ 해당 Novel의 Chapter 목록 조회
```

---

## 회차 목록 조회

```text
Chapter Collection
→ novel_id 기준 조회
→ order 기준 정렬
```

---

## 글 작성

```text
1. 로그인 사용자 확인
2. author_id 확인
3. novel_id 확인
4. Chapter 생성
```

---

## 6. 권한 처리 기준

---

## User 기준

```text
로그인 사용자만 작성 가능
```

---

## Novel 기준

```text
작성자(author_id)만 수정/삭제 가능
```

---

## Chapter 기준

```text
작성자(author_id)만 수정/삭제 가능
```

---

## 7. 데이터 무결성 규칙

* email은 중복 불가
* Novel은 반드시 author_id를 가져야 한다
* Chapter는 반드시 novel_id를 가져야 한다
* Chapter의 order는 동일 novel 내에서 중복되지 않아야 한다

---

## 8. 향후 확장 고려

초기 MVP에서는 제외하지만, 다음 구조를 고려한다:

---

### 댓글 (Comment)

```js
Comment {
  _id: ObjectId,
  chapter_id: ObjectId,
  user_id: ObjectId,
  content: String,
  created_at: Date
}
```

---

### 좋아요 (Like)

```js
Like {
  _id: ObjectId,
  user_id: ObjectId,
  target_type: String,  // "novel" | "chapter"
  target_id: ObjectId
}
```

---

### 구독 (Subscription)

```js
Subscription {
  _id: ObjectId,
  user_id: ObjectId,
  novel_id: ObjectId
}
```

---

## 9. 네이밍 규칙

* 컬렉션: 단수형 (User, Novel, Chapter)
* 필드: snake_case 사용
* 외래키: xxx_id 형식 사용

---

## 10. Mongoose 모델 방향

각 컬렉션은 다음 경로에 정의한다:

```text
src/backend/src/models/
```

파일 구조:

```text
User.js
Novel.js
Chapter.js
```

---

## 11. 향후 최적화

MVP 이후:

* 조회 성능 개선 (index 추가)
* 인기순 정렬용 필드 추가
* 캐싱 (Redis)
* 조회 API 분리

---

## 12. 요약

```text
User → 사용자
Novel → 작품
Chapter → 글

핵심 관계:
User → Novel → Chapter
```