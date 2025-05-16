## 🛠️ 프로젝트 시작 방법

# event-reward-system\auth\.env파일에는 
# MONGO_DB와, JWT_SECRET key를 설정할 수 있습니다.
MONGO_URL=mongodb://mongo:27017/auth-db
JWT_SECRET=yksSecretKey123

## AUTH 설치
nest new auth

## AUTH 설치 의존성
```bash
npm install @nestjs/mongoose
npm install @nestjs/config

npm install @nestjs/jwt
npm install @nestjs/passport passport passport-jwt
npm install bcrypt
npm install class-validator class-transformer

# NestJS + MongoDB용 패키지 설치
npm install @nestjs/mongoose mongoose

# 서버 실행
npm run start

```

## GATEWAY 설치
nest new gateway

## GATEWAY 설치 의존성
```bash
npm install @nestjs/mongoose
npm install @nestjs/config

npm install passport-jwt
npm install @nestjs/jwt
npm install @nestjs/passport

npm install @nestjs/serve-static

#NestJS에서 정적 파일을 제공
npm install @nestjs/serve-static

# GATEWAY 인증 및 역할 검사 구현
\event-reward-system\gateway\src\auth
```

## EVENT 설치
nest new event
## EVENT 설치 의존성
```bash
npm install class-validator class-transformer
```

# 테스트절차 
POSTMAN을 준비합니다.
(로컬환경테스트는 반드시 다운로드 및 설치가 필요합니다.)
https://www.postman.com/

# 회원가입
http://localhost:3001/auth/register
{
	"username": "사용자ID",
    "password":"사용자PW",
    "role":"사용자권한('USER','OPERATOR','AUDITOR','ADMIN',)"
}

# 로그인
http://localhost:3001/auth/login
{
  "username": "사용자ID",
  "password": "사용자PW"
}

# 로그인 인증 작동 확인방법
http://localhost:3002/events
{
  "title": "출석 이벤트",
  "description": "3일 출석 시 포인트 지급"
}

로그인 후 전달 받은 JWT 토큰을 
헤더에 다음과 같은 형태로 넣고 요청
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI1ODJiZDk4ZmQwZmRjNDEwZDM3M2YiLCJ1c2VybmFtZSI6InRlc3R1c2VyMSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQ3Mzc0MDkxLCJleHAiOjE3NDczNzc2OTF9.zW6L51BnyulNWx8KiuPzqocvKFDdF0FLjjnLRqbzHac
Content-Type:application/json

(권한이 맞으면 요청 성공, 권한 없으면 403 Forbidden 에러 발생.
토큰 없거나 유효하지 않으면 401 Unauthorized 에러 발생.)

mongo : 27017
gateway 서비스 : http://localhost:3000/
auth 서비스 : http://localhost:3001/
event 서비스 : http://localhost:3002/

# 로그확인방법
docker-compose logs -f gateway
docker-compose logs -f auth
docker-compose logs -f event


서버 구성:
서버 주요 역할
Gateway Server : 모든 API 요청의 진입점, 인증, 권한 검사 및 라우팅
Auth Server : 유저 정보 관리, 로그인, 역할 관리, JWT 발급
Event Server : 이벤트 생성, 보상 정의, 보상 요청 처리, 지급 상태 저장

🔧 기능 상세
1. Gateway Server
- 모든 요청을 받아 라우팅 수행
- JWT 토큰 검증 및 역할(Role) 검사
- NestJS의 @nestjs/passport , AuthGuard , RolesGuard 사용

2. Auth Server
- 유저 등록 / 로그인 / 역할(role) 관리
- JWT 관리
- 예시 역할:
- 역할 권한 설명
- USER 보상 요청 가능
- OPERATOR 이벤트/보상 등록
- AUDITOR 보상 이력 조회만 가능
- ADMIN 모든 기능 접근 가능

3. Event Server
📌 1. 이벤트 등록 / 조회
운영자 또는 관리자가 이벤트를 생성할 수 있어야 합니다.
이벤트에는 조건(예: 로그인 3일, 친구 초대 등)과 기간, 상태(활성/비활성) 정보가 포함
됩니다.
등록된 이벤트는 목록 또는 상세 조회가 가능해야 합니다.
📌 2. 보상 등록 / 조회
이벤트에 연결된 보상 정보를 추가할 수 있어야 합니다.
보상은 포인트, 아이템, 쿠폰 등 자유롭게 구성 가능하며 수량이 포함됩니다.
각 보상은 어떤 이벤트와 연결되는지가 명확해야 합니다.
📌 3. 유저 보상 요청
유저는 특정 이벤트에 대해 보상을 요청할 수 있어야 합니다.
시스템은 조건 충족 여부를 검증해야 합니다.
중복 보상 요청은 막아야 하며, 요청 상태(성공/실패 등)는 기록해야 합니다.
📌 4. 보상 요청 내역 확인
유저는 본인의 요청 이력을 볼 수 있어야 합니다.
운영자 / 감사자 / 관리자는 전체 유저의 요청 기록을 조회할 수 있어야 합니다.
필터링 기능(이벤트별, 상태별 등)은 선택적으로 구현해도 됩니다.

🔐 인증 구조
JWT 기반 인증

