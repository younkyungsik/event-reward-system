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

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  // 초기 인증 없이 허용되는 경로
  @All(['/register', '/login'])
  async authProxy(@Req() req: ExpressRequest, @Res() res: Response) {
    const authServiceUrl = `http://auth:3000/auth${req.originalUrl}`;
    return this.forwardRequest(req, res, authServiceUrl);
  }

  // 인증 필요: /events 전체
  @All(['/events', '/rewards', '/reward-requests'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async eventProxy(@Req() req: ExpressRequest, @Res() res: Response) {
    const eventServiceUrl = `http://event:3000${req.originalUrl}`;
    return this.forwardRequest(req, res, eventServiceUrl);
  }

  // 공통 요청 전달 처리
  private async forwardRequest(req: ExpressRequest, res: Response, targetUrl: string) {
    console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${targetUrl}`);
    console.log(`[Gateway] Body: `, req.body);
    const headers = {
      ...req.headers,
      host: undefined,
      'content-length': undefined,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: targetUrl,
          headers,
          data: req.body,
        }),
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      const status = error?.response?.status || 500;
      const data = error?.response?.data || { message: 'Proxy Error' };
      return res.status(status).json(data);
    }
  }
}
