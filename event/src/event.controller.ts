import { Controller, Post, Body } from '@nestjs/common';

@Controller('events')
export class EventController {
  @Post()
  @Post('/')
  createEvent(@Body() body: any) {
    return {
      message: '이벤트가 성공적으로 등록되었습니다.',
      data: body,
    };
  }
}
