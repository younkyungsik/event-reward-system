import { SetMetadata } from '@nestjs/common';

//이 데코레이터는 @Roles('ADMIN')처럼 사용되며, 권한 목록을 메타데이터로 설정합니다.
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
