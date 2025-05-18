import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    role?: string; // 필요 시 추가
    // 다른 사용자 정보도 여기에 추가 가능
  };
}
