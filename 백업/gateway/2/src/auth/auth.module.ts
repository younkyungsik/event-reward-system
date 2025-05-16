import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PassportModule, JwtModule.register({})],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
