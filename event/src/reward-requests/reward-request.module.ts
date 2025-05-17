import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './reward-request.schema';
import { RewardRequestService } from './reward-request.service';
import { RewardRequestController } from './reward-request.controller';
import { EventsService } from '../events/events.service';
import { UserActivityLog, UserActivityLogSchema } from '../schemas/user-activity-log.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    MongooseModule.forFeature(
      [{ name: UserActivityLog.name, schema: UserActivityLogSchema }],
      'AuthConnection', // 다른 DB 연결
    ),
    forwardRef(() => EventsModule),
  ],
  providers: [RewardRequestService, EventsService],
  controllers: [RewardRequestController],
})
export class RewardRequestModule {}
