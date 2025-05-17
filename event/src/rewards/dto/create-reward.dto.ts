import { IsString, IsNumber } from 'class-validator';

// 보상 등록 API dto
export class CreateRewardDto {
  @IsString()
  eventId: string;

  @IsString()
  creator: string;  // 인증 토큰에서 설정되면 없어도 됨

  @IsString()
  type: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;
  
}
