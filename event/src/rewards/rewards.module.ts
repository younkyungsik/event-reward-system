import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward, RewardSchema } from './schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }])
  ],
  controllers: [RewardsController],
  providers: [RewardsService],  // 필수
  exports: [RewardsService],    // 다른 모듈에서 사용하려면 필요
})
export class RewardsModule {}
