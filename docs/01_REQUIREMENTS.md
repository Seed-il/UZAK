# Requirements

## 핵심 서비스
웹소설 읽기 + 간단한 연재

---

## 사용자 유형
1. 일반 사용자 (독자)
2. 작가

---

## 사용자 시나리오 (MVP 기준)

### [독자]
1. 회원가입
2. 로그인
3. 작품 목록 보기
4. 작품 클릭 → 내용 보기

### [작가]
1. 로그인
2. 작품 생성
3. 글 작성
4. 저장

---

## MVP 기능 범위

### 포함
- 회원가입 / 로그인
- 작품 목록 조회
- 작품 상세 조회
- 작품 생성 (작가)
- 글 작성

### 제외 (초기)
- 결제
- 구독
- 피드
- 팔로우
- 관리자 기능


## 핵심 데이터 구조 (초안)

### User
- id
- email
- password
- nickname
- role (reader / writer)

### Novel (작품)
- id
- title
- description
- author_id
- created_at

### Chapter (글)
- id
- novel_id
- title
- content
- created_at