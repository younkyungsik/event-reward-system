// gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

import { EventsProxyController } from './events-proxy.controller';
import { AuthProxyController } from './auth-proxy.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env를 전역 설정으로 사용
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [EventsProxyController, AuthProxyController],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AppModule {}
