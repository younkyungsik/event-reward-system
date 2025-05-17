import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserActivityLogService } from '../user-activity-log/user-activity-log.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logService: UserActivityLogService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = (user as any)._doc;
    return result;
  }
  
  async login(username: string, password: string) {
  const user = await this.validateUser(username, password);
  const payload = { sub: user._id, username: user.username, role: user.role };
  console.log(`[Auth Server] 로그인 : `, username);
  //return {access_token: this.jwtService.sign(payload),};

  // 로그인 로그 기록
  await this.logService.logUserLogin(user._id);

  return {
    access_token: this.jwtService.sign(payload),
    userId: user._id,
    username: user.username,
    role: user.role,
  };
}

  async register(registerDto: RegisterDto) {
    const { username, password, role } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`[Auth Server] 회원가입 : `, username);
    return this.usersService.create(username, hashedPassword, role);
  }
}
