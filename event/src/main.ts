/*
//기존코드
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
*/
import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);

  // 전역 ValidationPipe (DTO 검증용, 선택)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 값 제거
    forbidNonWhitelisted: true, // 정의되지 않은 값이 있으면 에러 발생
    transform: true, // payload를 DTO 타입으로 자동 변환
  }));

  await app.listen(3000); // Event 서버 포트
  console.log(`Event service is running on: http://localhost:3000`);
}
bootstrap();