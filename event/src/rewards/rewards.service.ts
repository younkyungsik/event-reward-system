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
  async findAll(user: { 
            userId: string; 
            role: string 
        }, 
        filter: { 
            eventId?: string; 
            creator?: string; 
            type?: string; 
            description?: string; 
            amount?: number 
          }): Promise<any[]> {
            const query: any = {};

            // 필터링 기능 eventId별
            if (filter.eventId) {
                query.eventId = filter.eventId;
            }
            // 필터링 기능 creator별
            if (filter.creator) {
              query.creator = filter.creator;
            }
            // 필터링 기능 type별
            if (filter.type) {
              query.type = filter.type;
            }
            // 필터링 기능 description별
            if (filter.description) {
                query.description = filter.description;
            }
            // 필터링 기능 amount별
            if (filter.amount) {
                query.amount = filter.amount;
            }
          return this.rewardModel.find(query).exec();
  }

  //생성자가 등록한 모든 보상 검색
  async findAllByCreator(creator: string): Promise<Reward[]> {
    const rewards = await this.rewardModel.find({ creator }).exec();
    if (!rewards || rewards.length === 0) {
        throw new NotFoundException(`생성자(${creator})가 만든 이벤트가 없습니다.`);
    }
    return rewards;
  }

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