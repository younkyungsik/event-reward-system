import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest } from './reward-request.schema';
import { CreateRewardRequestDto } from './create-reward-request.dto';
import { RewardConditionService } from './reward-condition.util'; // 유틸 추가
import { successResponse, errorResponse } from '../common/helpers/response.helper';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequest>,
    private readonly conditionService: RewardConditionService,
  ) {}

  // 보상요청 API
  async create(createDto: CreateRewardRequestDto, userId: string) {
    const { eventId, rewardId } = createDto;

    const duplicate = await this.rewardRequestModel.findOne({
      userId,
      eventId,
      rewardId,
      status: 'SUCCESS',
    });

    if (duplicate) {
        const failedRequest = await this.rewardRequestModel.create({
            ...createDto,
            userId,
            eventId,
            rewardId,
            status: 'FAILED',
            reason: '이미 요청된 보상입니다.',
        });

        return errorResponse('보상 조건을 충족하지 못했습니다.', failedRequest);
    }

    const { ok, reason } = await this.conditionService.validate(eventId, rewardId, userId);

    if (!ok) {
        const failedRequest = await this.rewardRequestModel.create({
            ...createDto,
            userId,
            eventId,
            rewardId,
            status: 'FAILED',
            reason: '보상 조건을 충족하지 못했습니다.',
        });
        return errorResponse('보상 조건을 충족하지 못했습니다.', failedRequest);
    }

    const created = new this.rewardRequestModel({
      ...createDto,
      userId,
      status: 'SUCCESS',
      reason: '보상을 요청합니다.',
    });

    const saved = await created.save();
    return successResponse('보상 요청 성공', saved);
  }

  // 보상 요청 이력 조회 API
  async findAll(
    user: { 
        userId: string; 
        role: string 
    }, 
    filter: { 
        eventId?: string; 
        rewardId?: string; 
        userId?: string; 
        status?: string; 
        reason?: string; 
        createdAt?: string; 
        updatedAt?: string }
    ) {
  const query: any = {};

  // 일반 사용자는 본인 데이터만 조회
  if (user.role === 'USER') {
    query.userId = user.userId;
  }

  //// 필터 옵션 (관리자든 사용자든 적용 가능)
  // 필터링 기능 eventId별
  if (filter.eventId) {
    query.eventId = filter.eventId;
  }
  // 필터링 기능 rewardId별
  if (filter.rewardId) {
    query.rewardId = filter.rewardId;
  }
  // 필터링 기능 userId별
  if (filter.userId) {
    query.userId = filter.userId;
  }
  // 필터링 기능 status별
  if (filter.status) {
    query.status = filter.status;
  }
  // 필터링 기능 reason별
  if (filter.reason) {
    query.reason = filter.reason;
  }
  // 필터링 기능 createdAt별
  if (filter.createdAt) {
    query.createdAt = filter.createdAt;
  }
  // 필터링 기능 updatedAt별
  if (filter.updatedAt) {
    query.updatedAt = filter.updatedAt;
  }


  const results = await this.rewardRequestModel.find(query).sort({ createdAt: -1 });
  return {
    success: true,
    message: '보상 요청 이력 조회 성공',
    data: results,
  };
}
}