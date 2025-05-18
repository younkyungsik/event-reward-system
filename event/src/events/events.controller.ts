import { Controller, Post, Body, Req, UseGuards, Get, Param, Delete, Query} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

//이벤트 생성 API controller
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 이벤트 등록
  @Post('create') // POST /events/create
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') //운영자, 관리자
  createEvent(@Body() dto: CreateEventDto) {
    console.log(`[Event Server] 이벤트생성`);
    return this.eventsService.create(dto);
  }

  // 이벤트 "목록 및 상세" 조회 API
  @Post('select') // GET /events/select
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  getAllEventsByPost(@Req() req: RequestWithUser, @Body() body: any) {
    const user = req.user as any;
    return this.eventsService.findAll(user, body);
  }

  // 이벤트 id(seq)하나 삭제
  @Delete('delete/:id') // DELETE /events/select/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') // 운영자, 관리자
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

}
