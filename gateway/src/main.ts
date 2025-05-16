/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser'; // 추가

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // express json body parser 명시적 등록
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // 요청 본문 크기 제한 증가
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
}
bootstrap();