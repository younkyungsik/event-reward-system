import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserActivityLog } from './user-activity-log.schema';
import { Model } from 'mongoose';

// 유저 활동 로그 기록 서비스
@Injectable()
export class UserActivityLogService {
  constructor(
    @InjectModel(UserActivityLog.name)
    private readonly logModel: Model<UserActivityLog>,
  ) {}

  async logUserLogin(userId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 날짜만 비교

    const alreadyLogged = await this.logModel.exists({
      userId,
      type: 'login',
      date: today,
    });

    if (!alreadyLogged) {
      await this.logModel.create({
        userId,
        type: 'login',
        date: today,
      });
    }
  }
}
