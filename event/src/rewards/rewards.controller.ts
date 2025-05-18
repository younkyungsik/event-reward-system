import { Controller, Post, Body, Req, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

//보상 등록 API controller
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // 보상 등록
  @Post('create') // POST /create
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') //운영자, 관리자
  createEvent(@Body() dto: CreateRewardDto) {
    console.log(`[Event Server] 보상생성`);
    return this.rewardsService.create(dto);
  }

  // 등록된 모든 보상 목록 조회
  @Post('select') // GET /select
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR') //운영자, 관리자, 감사
  getAllEvents(@Req() req: RequestWithUser, @Body() body: any) {
    const user = req.user as any;
    return this.rewardsService.findAll(user, body);
  }

  // 보상 id(seq) 삭제
  @Delete('delete/:id') // DELETE /select/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR') //운영자, 관리자
  deleteEvent(@Param('id') id: string) {
    return this.rewardsService.delete(id);
  }
  
}
