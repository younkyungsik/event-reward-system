// gateway/src/auth-proxy.controller.ts
import {
  Controller,
  Req,
  Res,
  All,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller(['register', 'login']) // 경로: /register, /login
export class AuthProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All()
  async proxy(@Req() req: ExpressRequest, @Res() res: Response) {
    const authServiceUrl = `http://auth:3000/auth${req.originalUrl}`;
    console.log(`[Gateway Proxy] Forwarding ${req.method} ${req.originalUrl} → ${authServiceUrl}`);
    
    const headers = {
      ...req.headers,
      host: undefined,
      'content-length': undefined,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: authServiceUrl,
          headers,
          data: req.body,
        }),
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('[Auth Proxy Error]', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Proxy Error', error: error.message });
      }
    }
  }
}
