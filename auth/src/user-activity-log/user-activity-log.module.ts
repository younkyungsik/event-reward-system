import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserActivityLog, UserActivityLogSchema } from './user-activity-log.schema';
import { UserActivityLogService } from './user-activity-log.service';

// 유저 활동 로그 기록 모듈
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
    ]),
  ],
  providers: [UserActivityLogService],
  exports: [UserActivityLogService],
})
export class UserActivityLogModule {}
