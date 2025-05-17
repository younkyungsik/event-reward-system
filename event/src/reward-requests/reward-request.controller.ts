import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('reward-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async requestReward(@Req() req, @Body() body) {
    const userId = req.user.userId;
    const { eventId, rewardId } = body;
    return this.rewardRequestService.requestReward(userId, eventId, rewardId);
  }
}
