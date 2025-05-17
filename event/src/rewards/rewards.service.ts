import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Model } from 'mongoose';
import { CreateRewardDto } from './dto/create-reward.dto';

// 보상 등록 API service
@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  //생성
  async create(dto: CreateRewardDto): Promise<Reward> {
      return this.rewardModel.create(dto);
  }
  
  //전체검색
  async findAll(): Promise<any[]> {
      const rewardList = await this.rewardModel.find().exec();
      return this.rewardModel.find().exec();
  }

  //생성자가 등록한 모든 보상 검색
  async findAllByCreator(creator: string): Promise<Reward[]> {
    const rewards = await this.rewardModel.find({ creator }).exec();
    if (!rewards || rewards.length === 0) {
        throw new NotFoundException(`생성자(${creator})가 만든 이벤트가 없습니다.`);
    }
    return rewards;
  }
  //id로 검색
  /*
  async findById(id: string): Promise<Reward> {
      const reward = await this.rewardModel.findById(id).exec(); // exec 추가
      if (!reward) {
      throw new NotFoundException(`이벤트(id: ${id})를 찾을 수 없습니다.`); 
      }
      return reward; 
  }
  */

  // 삭제
  async delete(id: string): Promise<{ message: string }> {
      const result = await this.rewardModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
          throw new NotFoundException(`이벤트(id: ${id})를 찾을 수 없습니다.`);
      }
      return { message: `이벤트(id: ${id})가 삭제되었습니다.` };
  }

  async addRewardToEvent(rewardId: string, dto: CreateRewardDto): Promise<Reward> {
    return this.rewardModel.create({ ...dto, rewardId });
  }
}