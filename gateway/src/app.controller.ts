/*
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
*/

/*
import { Controller, Get } from '@nestjs/common';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';

@Controller('events')
export class EventsController {
  @Get()
  @Roles(Role.OPERATOR, Role.ADMIN, Role.USER)  // OPERATOR나 ADMIN, USER만 접근 가능
  findAll() {
    return "이벤트 목록 조회";
  }
}
*/
/*
import { Controller, Get } from '@nestjs/common';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';

@Controller('events')
export class EventsController {
  @Get()
  @Roles(Role.OPERATOR, Role.ADMIN)  // OPERATOR나 ADMIN만 접근 가능
  findAll() {
    return "이벤트 목록 조회";
  }
}
*/
import {
  Controller,
  Req,
  Res,
  All,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All(['', '*'])
  async proxy(@Req() req: ExpressRequest, @Res() res: Response, @Request() user: any) {
    //const eventServiceUrl = `http://event:3000${req.originalUrl}`;
    const eventServiceUrl = `http://event:3000${req.originalUrl.replace(/^\/events/, '') || '/'}`;
    //console.log(`${eventServiceUrl}`);
    console.log(`[Gateway Proxy] Forwarding ${req.method} ${req.originalUrl} → ${eventServiceUrl}`);
    const headers = {
      ...req.headers,
      host: undefined, // 호스트 헤더는 제거
    };
    console.log('req.body:', req.body);
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: eventServiceUrl,
          headers,
          data: req.body,
        }),
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Proxy Error', error: error.message });
      }
    }
  }
}
