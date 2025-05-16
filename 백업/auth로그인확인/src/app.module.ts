//기본컨트롤러와 서비스
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
//추가
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // .env 파일을 읽기 위한 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB 연결 (환경 변수 사용)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),

    // 기능 모듈
    AuthModule,
  ],
  //기본컨트롤러 없으면 {"message":"Cannot GET /","error":"Not Found","statusCode":404}나옴
  controllers: [AppController],
  //기본서비스
  providers: [AppService],
})
export class AppModule {}

/*
// 회원가입 : http://localhost:3001/auth/register?username=testuser&password=123456&role=USER
{
    "statusCode": 500,
    "message": "Internal server error"
}
// 로그인 : http://localhost:3001/auth/login?username=testuser&password=123456
*/

