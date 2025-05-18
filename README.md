## 📌 프로젝트 설계 개요

# 🎯 이벤트 설계
이벤트는 다음과 같은 요소들로 구성됩니다:
제목, 설명, 생성자, 기간, 조건, 상태 등의 필드를 포함했습니다.
조건 필드는 유연한 JSON 형태로 설계하여, 다양한 유형의 이벤트 조건(loginDays, gamePlayCount 등)이 확장 가능하도록 고려했습니다.
이벤트는 ADMIN, OPERATOR 권한을 가진 사용자가 등록할 수 있습니다.
이 구조를 통해 단순 출석 보상부터, 복잡한 플레이 조건 기반 보상까지 범용적으로 지원할 수 있도록 설계하였습니다.

# 🧩 조건 검증 방식
유저의 보상 요청 시 다음과 같은 순서로 조건을 검증합니다:
요청한 이벤트 및 보상 정보 조회
조건 정보 확인 (loginDays, 등)
로그인 로그 또는 활동 로그 기반으로 실제 충족 여부 판단
중복 요청 여부 확인 (이미 동일 유저가 해당 보상 요청을 했는지 확인)
결과를 기반으로 보상 지급 여부(SUCCESS, FAILED) 결정 및 이력 저장
이 검증 방식은 추후 다양한 조건(3일 연속 출석, 일정 이상 플레이, 아이템 보유 여부 등)을 동적으로 처리할 수 있도록 확장성을 고려했습니다.

# 🧱 API 구조 선택 이유
본 시스템은 NestJS + MongoDB + JWT 기반 MSA 구조로 구성되었습니다. 주요 구조 선택 이유는 다음과 같습니다:
MSA 분리: 인증(Auth), 이벤트/보상(Event), API Gateway 서버로 나누어 실제 서비스와 유사한 구조를 구현
API Gateway: 인증된 요청만 Event 서버에 전달하도록 설계, 보안 강화
JWT 인증 방식: stateless 방식의 토큰 인증을 통해 서버 간 인증 간소화
역할 기반 인가: USER, OPERATOR, ADMIN, AUDITOR의 역할 구분을 명확히 하여 기능 제한을 세분화

# 🤔 구현 중 고민 및 해결
처음에는 Event 서버가 인증 토큰을 직접 검증하지 않는 구조로 시작했지만, 현실적으로는 최소한의 JWT 인증이 필요했습니다. 그 이유는:
Gateway 서버에서 인증 검사를 하더라도, Event 서버가 사용자 ID 또는 권한 정보에 대한 신뢰성 확보가 어려움(권한 위조 방지)
따라서 Event 서버 내부에서도 @UseGuards(AuthGuard('jwt'))를 통해 기본적인 인증 및 사용자 정보 파싱은 필요하다는 결론에 도달했습니다.
이는 보안성과 확장성을 동시에 확보하기 위한 타협이었습니다.

## 🛠️ 프로젝트 시작 방법
1. Git설치(설치되어있으면 생략.)
2. 설치할 폴더 우클릭 -> 
  Open Git Bash here클릭 -> 
  git init(명령어입력) -> 
  git init(명령어입력) -> 
  git config --global user.name "younkyungsik"
  git config --global user.email "yks1634@gmail.com"

2. POSTMAN 설치(설치되어있으면 생략.)
3. git pull(https://github.com/younkyungsik/event-reward-system/tree/master)
4. 도커 컨테이너 실행
5. API 테스트 진행(8개)

## ※ 주의사항
1. API요청방식은 POST와 GET 방식이 존재합니다.
요청시 Body, Params 구분을 명확히 해야하며 
아래 "테스트 진행 순서"에 명시해두었습니다.

2. JWT 기반 인증이므로 JWT 인증 가드를 사용 및 추가되었습니다.
(권한이 맞으면 요청 성공, 권한 없으면 403 Forbidden 에러 발생.
토큰 없거나 유효하지 않으면 401 Unauthorized 에러 발생.)


# 도커 명령어
```bash
# 1. 실행
docker run
# 2. 컨테이너 중지 및 삭제
docker compose down
# 3. 이미지 재빌드 (수정사항 반영)
docker compose build
# 4. 컨테이너 재실행
docker compose up -d --build
# 5. 합쳐진 명령어(중지 및 삭제 후 재빌드)
docker compose down ; docker compose up --build
```

# 등록된 사용자
{
	"username": "testuser",
    "password":"123123",
    "role":"USER"
}
{
	"username": "testadmin",
  "password":"123123",
  "role":"ADMIN"
}
{
    "username": "testoper",
    "password": "123123",
    "role": "OPERATOR",
}
{
	"username": "testauditor",
    "password":"123123",
    "role":"AUDITOR"
}

# 테스트에 적합한 이벤트 선정
출석체크 이벤트를 선정하여 로직을 구현했습니다.
유저 활동 로그를 기록하여 출석한 N일에 대한 보상을 요청 및 지급합니다.

## 테스트 절차 
POSTMAN을 준비합니다.
(로컬환경테스트는 반드시 다운로드 및 설치가 필요합니다.)
https://www.postman.com/

# 테스트 팁
로그인 후 전달 받은 JWT 토큰을 헤더에 다음과 같은 형태로 넣고 요청해야합니다.
Authorization: Bearer <반환된 JWT_TOKEN 작성>
Content-Type:application/json
로그인시 응답: 
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI4MmYyNDExNGI0ZWVmNTQwZmQ2ZTIiLCJ1c2VybmFtZSI6InRlc3RhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NzQ3NzI0NCwiZXhwIjoxNzQ3NDgwODQ0fQ.vfn_v4eY4Qd4HXDkEfM8ImIuz4KmQErh-H5uxq7v8hU",
    "userId": "68282f24114b4eef540fd6e2",
    "username": "testadmin",
    "role": "ADMIN"
}


# 테스트 진행 순서
## 회원 가입 및 로그인 API
1. 회원가입 API(확인완료)
- 목적: 최초 회원가입시
- 요청 방식: POST http://localhost:3000/register
- 헤더: X
- 요청 Body: 
{
  "username": "testuser2",
  "password": "123123",
  "role": "USER"
}
- 응답: 
{
    "username": "testuser2",
    "password": "$2b$10$ahVVkc3QMVNOLnNhTY0qRuFIdWkJrY7xm2VGunvafgy.Pi/Yd.8eC",
    "role": "USER",
    "_id": "6829c3fe98099d565a6d71d1",
    "__v": 0
}

2. 로그인 API(확인완료)
- 목적: 최초 회원가입시
- 요청 방식: POST http://localhost:3000/login
- 헤더: X
- 요청 Body: 
{
  "username": "testuser2",
  "password": "123123"
}
- 응답: 
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI5YzNmZTk4MDk5ZDU2NWE2ZDcxZDEiLCJ1c2VybmFtZSI6InRlc3R1c2VyMiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQ3NTgzMjU1LCJleHAiOjE3NDc1ODY4NTV9.EPTMQrza1VKEAJ8qkG1Kaas9NgZb57sO12iWuqVt9-Q",
    "userId": "6829c3fe98099d565a6d71d1",
    "username": "testuser2",
    "role": "USER"
}

## 이벤트 등록 / 조회 API
3. 이벤트 등록 API(확인완료)
- 목적: 운영자 또는 관리자가 새로운 이벤트를 생성
- 요청 방식: POST http://localhost:3000/events/create
- 권한: ADMIN, OPERATOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 요청 Body: 
{
  "title": "출석 이벤트",
  "creator": "testadmin",
  "description": "1일 이상 로그인 시 보상 지급",
  "conditions": {
    "loginDays": 1
  },
  "startDate": "2025-05-01T00:00:00.000Z",
  "endDate": "2025-05-31T23:59:59.000Z",
  "status": "true"
}
- 응답 Body: 
{
    "title": "출석 이벤트",
    "conditions": {
        "loginDays": 1
    },
    "status": true,
    "startDate": "2025-05-01T00:00:00.000Z",
    "endDate": "2025-05-31T23:59:59.000Z",
    "creator": "testadmin",
    "_id": "6829f1e6ab40fb15725603a3",
    "__v": 0
}

4. 이벤트 "목록 및 상세" 조회 API(확인완료)
- 목적: 등록된 모든 이벤트들을 리스트로 확인
- 요청 방식: POST http://localhost:3000/events/select
- 권한: ADMIN, OPERATOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 필터 요청 Body(선택적): 
{
	"title": "출석 이벤트"
}
- 응답 Body: 
[
    {
        "_id": "6829040878fee900658610ce",
        "title": "출석 이벤트",
        "conditions": {
            "loginDays": 1
        },
        "status": true,
        "startDate": "2025-05-01T00:00:00.000Z",
        "endDate": "2025-05-31T23:59:59.000Z",
        "creator": "testadmin",
        "__v": 0
    },...
]

## 보상 등록 / 조회 API
5. 보상 등록 API(확인완료)
- 목적: 이벤트에 보상 정보(포인트, 아이템, 쿠폰 등)를 연결
- 요청 방식: POST http://localhost:3000/rewards/create
- 권한: OPERATOR, ADMIN
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 요청 Body: 
{
  "eventId": "6829040878fee900658610ce",
  "creator": "testadmin",
  "type": "POINT",
  "amount": 500,
  "description": "출석 1일 보상등록"
}
- 응답 Body: 
{
    "eventId": "6829040878fee900658610ce",
    "creator": "testadmin",
    "type": "POINT",
    "description": "출석 1일 보상등록",
    "amount": 500,
    "_id": "682a045b56e312291404a731",
    "__v": 0
}

6. 이벤트에 연결된 보상 "전체 및 상세" 조회 API(확인완료)
- 목적: 특정 이벤트에 어떤 보상이 등록되어 있는지 확인
- 요청 방식: GET http://localhost:3000/rewards/select
- 권한: OPERATOR, ADMIN, AUDITOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 필터 요청 Body(선택적): 
{
    "type": "POINT"
}
- 응답 Body: 
[
  {
    "_id":"6828aa3b1a22319a87949797",
    "eventId":"682884c42c2efeae0a18eecc",
    "creator":"testadmin",
    "type":"POINT",
    "description":"출석 3일 보상",
    "amount":500,
    "__v":0
  },
  ...
]

## 유저 보상 요청 
7. 보상 요청 API(확인완료)
- 목적: 유저가 특정 이벤트에 대해 보상을 요청
- 요청 방식: POST http://localhost:3000/reward-requests
- 권한: USER
- 헤더:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 요청 Body: 
{
    "eventId": "6828ba8e879861bc9902f823",
    "rewardId": "6828c054673ec0d234bb69a2"
}
- 응답1(조건 충족 시):
{
    "success": true,
    "message": "보상 요청 성공",
    "data": {
        "userId": "68283b762d1b5a5a94e611a1",
        "eventId": "6828ba8e879861bc9902f823",
        "rewardId": "6828c054673ec0d234bb69a2",
        "status": "SUCCESS",
        "_id": "6829c1da411aba8b950a9ca8",
        "createdAt": "2025-05-18T11:17:46.551Z",
        "updatedAt": "2025-05-18T11:17:46.551Z",
        "__v": 0
    }
}
- 응답2(중복 요청 시):
{
    "success": false,
    "message": "보상 조건을 충족하지 못했습니다.",
    "data": {
        "userId": "68283b762d1b5a5a94e611a1",
        "eventId": "6828ba8e879861bc9902f823",
        "rewardId": "6828c054673ec0d234bb69a2",
        "status": "FAILED",
        "reason": "이미 요청된 보상입니다."
    }
}

## 유저 보상 요청 내역 확인
8. 보상 요청 이력 조회 API(확인완료)
- 목적: 본인 또는 전체 유저의 보상 요청 이력을 필터링 조회
- 요청 방식: GET http://localhost:3000/reward-requests/select
- 권한:
1) USER: 본인 이력 필터링 조회
2) AUDITOR, ADMIN: 전체 이력 필터링 조회
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type:application/json
- 필터 요청(선택적) "Params" 예시: 
1) http://localhost:3000/reward-requests/select?status=SUCCESS
2) status:SUCCESS
- 응답1(USER):
{
    "success": true,
    "message": "보상 요청 이력 조회 성공",
    "data": [
        {
            "_id": "6829cb561290cf34cc7cc490",
            "userId": "68283b762d1b5a5a94e611a1",
            "eventId": "6828ba8e879861bc9902f823",
            "rewardId": "6828c054673ec0d234bb69a2",
            "status": "SUCCESS",
            "reason": "보상을 요청합니다.",
            "createdAt": "2025-05-18T11:58:14.828Z",
            "updatedAt": "2025-05-18T11:58:14.828Z",
            "__v": 0
        }
    ]
}
- 응답2(ADMIN):
{
    "success": true,
    "message": "보상 요청 이력 조회 성공",
    "data": [
        {
            "_id": "682a0b534bd98867d92dbc80",
            "userId": "68283b762d1b5a5a94e611a1",
            "eventId": "6828ba8e879861bc9902f823",
            "rewardId": "6828c054673ec0d234bb69a2",
            "status": "FAILED",
            "reason": "이미 요청된 보상입니다.",
            "createdAt": "2025-05-18T16:31:15.235Z",
            "updatedAt": "2025-05-18T16:31:15.235Z",
            "__v": 0
        },
        ...
    ]
}
- 응답3(ADMIN "필터링" 시)
{
    "success": true,
    "message": "보상 요청 이력 조회 성공",
    "data": [
        {
            "_id": "6829d1006c886ccb0ef7869b",
            "userId": "6829c3fe98099d565a6d71d1",
            "eventId": "6828ba8e879861bc9902f823",
            "rewardId": "6828c054673ec0d234bb69a2",
            "status": "SUCCESS",
            "reason": "보상을 요청합니다.",
            "createdAt": "2025-05-18T12:22:24.024Z",
            "updatedAt": "2025-05-18T12:22:24.024Z",
            "__v": 0
        },
        ...
    ]
}



# 개발/테스트 참고할 사항
- (docker-compose.yml참고)
mongo : 27017
gateway : 3000
auth : 3001
event : 3002

# event-reward-system\.env 파일은?
MONGO_DB와, JWT_SECRET key를 설정할 수 있습니다.

# 서버별 로그확인방법
docker-compose logs -f gateway
docker-compose logs -f auth
docker-compose logs -f event

# MongoDB 명령어
```bash
# MongoDB 컨테이너 접속
docker exec -it mongo mongosh
# DB 목록 확인
show dbs
# 컬렉션 목록 확인
show collections
# collection 삭제
db.[col이름].drop()
# 유저 DB로 이동
use auth-db
# 유저 전체 조회
db.users.find()
# 유저 필터링 조회
db.users.find({ role: "USER" }).pretty()
# 삭제
db.[col이름].deleteMany({ username: "testuser" })
db.[col이름].remove({ "status":"FAILED" })
# 로그인 로그 조회
db.loginlogs.find().pretty()
db["login-logs"].find().pretty()
# Database 삭제
db.dropDatabase()
```

# 서버 구성
서버 주요 역할
Gateway Server : 모든 API 요청의 진입점, 인증, 권한 검사 및 라우팅
Auth Server : 유저 정보 관리, 로그인, 역할 관리, JWT 발급
Event Server : 이벤트 생성, 보상 정의, 보상 요청 처리, 지급 상태 저장


# 서버구조
※ API요청은 전부 Gateway서버를 거칩니다.
[Client]
   | HTTP POST /register
   | HTTP POST /login + JWT
   | HTTP POST /events + JWT
[Gateway]
   |
   |  
   + [Auth] 검증 (JWT)
   | 
   | HTTP POST /events → Event 서버로 프록시
   |
[Event]
   |
   | 응답 (이벤트 등록됨)
   |
[Gateway]
   |
   | 응답 전달
   ↓
[Client]

# 인증/인가 처리
Auth 서버가 JWT를 발급하고, Gateway가 검증하는 구조

## AUTH, GATEWAY, EVENT 설치
nest new auth
nest new gateway
nest new event

## 사용된 의존성 설치 명령어 모음
```bash
npm install @nestjs/mongoose # NestJS + MongoDB용 패키지 설치
npm install @nestjs/config

npm install passport-jwt #jwt
npm install @nestjs/jwt
npm install @nestjs/passport
npm install @nestjs/passport passport passport-jwt
npm install bcrypt
npm install class-validator class-transformer

npm install @nestjs/serve-static #NestJS에서 정적 파일을 제공
```



