import { Controller, Post, Body, UseGuards, Get, Param, Delete} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

  // 등록된 모든 이벤트 목록 조회
  @Get('select') // GET /events/select
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') //운영자, 관리자
  getAllEvents() {
    return this.eventsService.findAll();
  }

  // 생성자가 만든 이벤트 상세 목록 조회
  @Get('select/:creator')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') // 운영자, 관리자
  getEventsByCreator(@Param('creator') creator: string) {
    return this.eventsService.findAllByCreator(creator);
  }

  // 이벤트 id(seq)하나 삭제
  @Delete('delete/:id') // DELETE /events/select/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN') // 운영자, 관리자
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

}
