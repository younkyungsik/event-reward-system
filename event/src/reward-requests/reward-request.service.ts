import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestDocument } from './reward-request.schema';
import { Model } from 'mongoose';
import { EventsService } from '../events/events.service'; // 이벤트 검증을 위해 필요
import { UserActivityLog } from '../schemas/user-activity-log.schema'; // auth DB에서 읽기
import mongoose from 'mongoose';
// import axios from 'axios';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(UserActivityLog.name, 'AuthConnection') // Auth DB에 연결 필요
    private activityLogModel: Model<UserActivityLog>,
    private readonly eventService: EventsService,
  ) {}

  async requestReward(userId: string, eventId: string, rewardId: string) {
    // 1. 중복 요청 확인
    const exists = await this.rewardRequestModel.exists({ userId, eventId, rewardId });
    if (exists) {
      return { success: false, message: '이미 보상을 요청했습니다.' };
    }

    // 2. 이벤트 조건 검증 (예: 오늘 출석했는가?)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activity = await this.activityLogModel.exists({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'login',
      date: today,
    });

    const isEligible = !!activity;

    // 3. 보상 요청 저장
    const result = await this.rewardRequestModel.create({
      userId,
      eventId,
      rewardId,
      status: isEligible ? 'SUCCESS' : 'FAILED',
      reason: isEligible ? undefined : '조건 미충족',
    });

    return {
      success: isEligible,
      message: isEligible ? '보상 요청 성공' : '보상 조건을 충족하지 못했습니다.',
      data: result,
    };
  }
}
