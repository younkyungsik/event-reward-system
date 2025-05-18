import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginLogModule } from '../login-log/login-log.module';

@Module({
  imports: [
    forwardRef(() => UsersModule), 
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    LoginLogModule, //유저 활동 로그 기록 모듈
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  
})
export class AuthModule {}
