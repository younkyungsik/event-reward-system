import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from '../auth/dto/login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; role?: string }) {
    const existingUser = await this.usersService.findByUsername(body.username);
    if (existingUser) {
      throw new BadRequestException('사용자 이름이 이미 존재합니다.');
    }

    const user = await this.usersService.create(body.username, body.password, body.role);
    return { message: '사용자가 성공적으로 등록되었습니다', user: { username: user.username, role: user.role } };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }
}
