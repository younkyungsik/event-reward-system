import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLog, LoginLogSchema } from './login-log.schema';
import { LoginLogService } from './login-log.service';

// 유저 활동 로그 기록 모듈
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginLog.name, schema: LoginLogSchema },
    ]),
  ],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
