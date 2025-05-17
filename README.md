## 🛠️ 프로젝트 시작 방법

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

# 테스트 절차 
POSTMAN을 준비합니다.
(로컬환경테스트는 반드시 다운로드 및 설치가 필요합니다.)
https://www.postman.com/

# 회원가입
http://localhost:3000/register
{
  "username": "사용자ID",
  "password":"사용자PW",
  "role":"사용자권한('USER','OPERATOR','AUDITOR','ADMIN')"
}

# 로그인
http://localhost:3000/login
{
  "username": "사용자ID",
  "password": "사용자PW"
}

# 테스트 팁
1. 로그인 후 전달 받은 JWT 토큰을 헤더에 다음과 같은 형태로 넣고 요청해야합니다.
Authorization: Bearer <반환된 JWT_TOKEN 작성>
Content-Type:application/json
로그인시 응답: 
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI4MmYyNDExNGI0ZWVmNTQwZmQ2ZTIiLCJ1c2VybmFtZSI6InRlc3RhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NzQ3NzI0NCwiZXhwIjoxNzQ3NDgwODQ0fQ.vfn_v4eY4Qd4HXDkEfM8ImIuz4KmQErh-H5uxq7v8hU",
    "userId": "68282f24114b4eef540fd6e2",
    "username": "testadmin",
    "role": "ADMIN"
}
※ JWT 기반 인증이므로 JWT 인증 가드를 사용 및 추가했습니다.

(권한이 맞으면 요청 성공, 권한 없으면 403 Forbidden 에러 발생.
토큰 없거나 유효하지 않으면 401 Unauthorized 에러 발생.)

# 테스트 절차 (API 10개)
# 0. 회원 가입 및 로그인 API
1. 회원가입 API(확인완료)
- 목적: 최초 회원가입시
- 요청 방식: POST http://localhost:3000/register
- 헤더: X
- 요청 Body: 
{
	"username": "testuser",
    "password":"123123",
    "role":"USER"
}

2. 로그인 API(확인완료)
- 목적: 최초 회원가입시
- 요청 방식: POST http://localhost:3000/login
- 헤더: X
- 요청 Body: 
{
	"username": "testuser",
    "password":"123123",
    "role":"USER"
}

# 1. 이벤트 등록 / 조회 API
3. 이벤트 생성 API(확인완료)
- 목적: 운영자 또는 관리자가 새로운 이벤트를 생성
- 요청 방식: POST http://localhost:3000/events/create
- 권한: ADMIN, OPERATOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 요청 Body: 
{
  "title": "로그인 3일",
  "description": "3일 이상 로그인 시 보상 지급",
  "conditions": {
    "loginDays": 3
  },
  "status": "true",
  "startDate": "2025-05-01T00:00:00.000Z",
  "endDate": "2025-05-31T23:59:59.000Z",
  "creator": "testadmin"
}
- 응답 Body: 
{
  "title":"로그인 3일",
  "conditions":{"loginDays":3},
  "status":true,
  "startDate":"2025-05-01T00:00:00.000Z","endDate":"2025-05-31T23:59:59.000Z",
  "creator":"testadmin",
  "_id":"6828bbd4673ec0d234bb6984",
  "__v":0
}

4. 이벤트 목록 "전체 조회" API(확인완료)
- 목적: 등록된 모든 이벤트들을 리스트로 확인
- 요청 방식: GET http://localhost:3000/events/select
- 권한: ADMIN, OPERATOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 응답 Body: 
[
  {
    "id": "testadmin",
    "title": "출석 이벤트",
    "description": "3일 이상 로그인 시 보상",
    "conditions": {
      "loginDays": 3
    },
    "status": "ACTIVE"
  },
  ...
]

5. 특정 이벤트 "상세(등록자 기반) 조회" API(확인완료)
- 목적: 특정 이벤트의 조건, 기간, 상태 등 상세 정보 확인
- 요청 방식: GET http://localhost:3000/events/select/:username
- 예시: GET http://localhost:3000/events/select/testadmin
- 권한: ADMIN, OPERATOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 응답 Body: 
[
  {
    "_id":"6828ba8e879861bc9902f823",
    "title":"로그인 3일",
    "creator":"testadmin",
    "conditions":{"loginDays":3},
    "status":true,
    "startDate":"2025-05-01T00:00:00.000Z","endDate":"2025-05-31T23:59:59.000Z",
    "__v":0
    }
]

# 2. 보상 등록 / 조회 API
6. 보상 등록 API(확인완료)
- 목적: 이벤트에 보상 정보(포인트, 아이템, 쿠폰 등)를 연결
- 요청 방식: POST http://localhost:3000/rewards/create
- 권한: OPERATOR, ADMIN
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
요청 Body: 
{
  "eventId": "6828ba8e879861bc9902f823",
  "creator": "testadmin",
  "type": "POINT",
  "amount": 500,
  "description": "출석 3일 보상"
}
- 응답 Body: 
{
  "eventId":"6828ba8e879861bc9902f823",
  "creator":"testadmin",
  "type":"POINT",
  "description":"출석 3일 보상",
  "amount":500,
  "_id":"6828c054673ec0d234bb69a2",
  "__v":0
}

7. 이벤트에 연결된 보상 "전체 조회" API(확인완료)
- 목적: 특정 이벤트에 어떤 보상이 등록되어 있는지 확인
- 요청 방식: GET http://localhost:3000/rewards/select
- 권한: OPERATOR, ADMIN, AUDITOR
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
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

8. 이벤트에 연결된 보상 "상세(등록자 기반) 조회" API(확인완료)
- 목적: 특정 이벤트에 어떤 보상이 등록되어 있는지 확인
- 요청 방식: GET http://localhost:3000/rewards/select/:username
- 예시: GET http://localhost:3000/rewards/select/testadmin
- 권한: 모든 인증된 사용자 가능
- 헤더: O
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
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

# 3. 유저 보상 요청 
9. 보상 요청 API
목적: 유저가 특정 이벤트에 대해 보상을 요청
요청 방식: POST http://localhost:3000/reward-requests
권한: USER
헤더:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
- 응답1(조건 충족 시):
{
  "status": "SUCCESS",
  "message": "보상이 지급되었습니다.",
  "data": {
    "eventId": "665abc1234...",
    "status": "SUCCESS"
  }
}
- 응답2(조건 불충족 시):
{
  "status": "FAILURE",
  "message": "조건을 충족하지 못했습니다.",
  "reason": "로그인 3일 조건 미충족"
}
- 응답3(중복 요청 시):
{
  "status": "DUPLICATE",
  "message": "이미 요청한 이벤트입니다."
}

# 4. 유저 보상 요청 내역 확인
10. 보상 요청 이력 조회 API
목적: 본인 또는 전체 유저의 보상 요청 이력을 조회
요청 방식: GET http://localhost:3000/reward-requests
권한:
USER: 본인 이력만 조회
AUDITOR, ADMIN: 전체 이력 조회 가능
필터 (선택 적용): ?eventId=...&status=SUCCESS|FAILURE|DUPLICATE
헤더:
Authorization: Bearer <JWT_TOKEN>
- 응답:
[
  {
    "userId": "user123",
    "eventId": "665abc1234...",
    "status": "SUCCESS",
    "requestedAt": "2025-05-16T12:00:00.000Z"
  },
  ...
]

# 개발시 참고할 사항
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

# MongoDB 컨테이너 접속
docker exec -it mongo mongosh
# DB 목록 확인
show dbs
# 컬렉션 목록 확인
show collections
# 유저 DB로 이동
use auth-db
# 유저 전체 조회
db.users.find()
# 유저 필터링 조회
db.users.find({ role: "USER" }).pretty()
# 유저 삭제
db.users.deleteMany({ username: "testuser" })


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



