/*
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/auth'), // 도커 내 서비스 이름 사용
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/

// event/src/app.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [],
})
export class AppModule {}