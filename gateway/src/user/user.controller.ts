import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() body: { username: string; password: string },
  ) {
    const { username, password } = body;
    const existingUser = await this.userService.findOneByUsername(username);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userService.createUser(username, password);
    return { message: 'User created successfully', user: newUser };
  }
}
