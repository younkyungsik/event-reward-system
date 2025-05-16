import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 컨트롤러 혹은 핸들러에 붙은 @Roles() 데코레이터에 명시된 역할들을 가져온다.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // 역할 제한이 없으면 그냥 통과
      return true;
    }

    // 현재 요청의 user 객체 (JWT Strategy에서 validate 후 request.user에 저장됨)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('No user role found');
    }

    // user의 역할이 requiredRoles에 포함되어 있으면 true, 아니면 예외 발생
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('You do not have permission (role mismatch)');
  }
}
