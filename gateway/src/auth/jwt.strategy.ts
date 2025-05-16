import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret',
      secretOrKey: 'yksSecretKey123',
    });
  }

  async validate(payload: any) {
    // JWT payload를 기반으로 요청 유저 정보를 반환
    // 필요시 DB 조회 가능
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
  
}

