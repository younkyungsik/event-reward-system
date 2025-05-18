import { Controller, Post, Body, Req, Get, UseGuards, Query } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { CreateRewardRequestDto } from './create-reward-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // JWT 인증 가드
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
//import { Request } from 'express';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';


@Controller('reward-requests')
export class RewardRequestsController {
  constructor(private readonly rewardRequestsService: RewardRequestsService) {}

  // 보상 요청
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('USER', 'ADMIN')
  async create(
    @Body() createDto: CreateRewardRequestDto,
    //@Req() req: Request, //Express의 Request 타입이 기본적으로 user 속성을 포함하지 않기 때문에 발생
    @Req() req: RequestWithUser,
  ) {
    const user = req.user as any; // JWT로부터 추출된 유저 정보
    return this.rewardRequestsService.create(createDto, user.userId);
  }

  // 보상 조회
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('select')
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  async findAll(
    @Req() req: RequestWithUser, @Query() query: any) {
    const user = req.user as any; // JWT로부터 추출된 유저 정보
    return this.rewardRequestsService.findAll(user, query);
  }
}
