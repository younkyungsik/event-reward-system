import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './reward-request.schema';
import { RewardRequestsService } from './reward-requests.service';
import { RewardRequestsController } from './reward-requests.controller';
import { LoginLogSchema } from './login-log.schema';
import { RewardConditionService } from './reward-condition.util';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: 'LoginLog', schema: LoginLogSchema }, // 로그인 로그 스키마 추가
    ]),
],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService, RewardConditionService],
})
export class RewardRequestsModule {}
