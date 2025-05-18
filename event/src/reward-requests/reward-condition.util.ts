//보상 조건 검증 유틸 함수
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RewardConditionService {
  constructor(
    @InjectModel('LoginLog') private readonly loginLogModel: Model<any>,
  ) {}

  async validate(eventId: string, rewardId: string, userId: string): Promise<{ ok: boolean; reason?: string }> {
    // 예: eventId에 따라 조건 다르게 분기
    if (eventId === '6828ba8e879861bc9902f823') { // 1일 출석 체크 이벤트
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const login = await this.loginLogModel.findOne({
        userId,
        timestamp: { $gte: today, $lt: tomorrow },
      });

      if (!login) {
        return { ok: false, reason: '오늘 로그인 기록이 없습니다.' };
      }

      return { ok: true };
    }

    return { ok: false, reason: '조건 검증 미구현 이벤트입니다.' };
  }
}
