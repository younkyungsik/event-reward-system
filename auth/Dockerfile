# Dockerfile
# 1. Node 이미지 선택
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. NestJS 빌드
RUN npm run build

# 6. 앱 실행
CMD ["npm", "run", "start:prod"]
