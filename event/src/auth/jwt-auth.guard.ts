import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//이 Guard는 passport-jwt 전략을 활용하며, 사용자 인증을 처리합니다.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
