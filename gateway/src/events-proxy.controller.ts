// gateway/src/events-proxy.controller.ts
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

/*
경로: 
/events(이벤트 등록/조회), 
/rewards(보상 등록/조회), 
/reward-requests(보상 요청)
*/
@Controller(['events','rewards','reward-requests'])
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All(['', '*'])
  async proxy(@Req() req: ExpressRequest, @Res() res: Response, @Request() user: any) {
    const eventServiceUrl = `http://event:3000${req.originalUrl}`;// event Server로 전송
    console.log(`[Gateway Proxy] Forwarding ${req.method} ${req.originalUrl} → ${eventServiceUrl}`);

    const headers = {
      ...req.headers,
      host: undefined,
      'content-length': undefined,
    };

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
      console.error('[Event Proxy Error]', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Proxy Error', error: error.message });
      }
    }
  }
}
