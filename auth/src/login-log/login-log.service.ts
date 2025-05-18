import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginLog } from './login-log.schema';
import { Model } from 'mongoose';

// 유저 활동 로그 기록 서비스
@Injectable()
export class LoginLogService {
  constructor(
    @InjectModel(LoginLog.name)
    private readonly logModel: Model<LoginLog>,
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
