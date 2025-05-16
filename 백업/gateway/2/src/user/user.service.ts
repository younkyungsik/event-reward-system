// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>, // Mongoose 모델 주입
  ) {}

  // username으로 사용자 찾기
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // 사용자 생성 예시
  async createUser(username: string, password: string): Promise<User> {
    const newUser = new this.userModel({ username, password});
    return newUser.save();
  }
}
