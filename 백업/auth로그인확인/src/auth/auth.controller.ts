// auth/src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
  const { username, password } = loginDto;
  //로그인 시 username과 password로 인증에서 사용자 정보 반환됨
  // return this.authService.validateUser(loginDto.username, loginDto.password);
  //access_token으로 리턴
  return this.authService.login(username, password);
}
}
