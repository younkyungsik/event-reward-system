import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
// Auth DB 연결 설정 추가
import { RewardRequestsModule } from '../reward-requests/reward-requests.module';

@Module({
  imports: [
    // 이벤트 서버 자체 Mongo 연결 (기존 event DB)
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),

    // Auth DB 연결 설정 추가
    MongooseModule.forRoot(process.env.MONGO_URI_AUTH || 'mongodb://mongo:27017/auth', {
      connectionName: 'AuthConnection',
    }),
    //forwardRef(() => RewardRequestsModule),
    RewardRequestsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],  // 필수
  exports: [EventsService, MongooseModule],    // 다른 모듈에서 사용하려면 필요
})
export class EventsModule {}
