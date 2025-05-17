import { IsString, IsObject, IsEnum, IsBoolean } from 'class-validator';

//이벤트 생성 API dto
export class CreateEventDto {
  // 이벤트 조건 및 제목
  @IsString()
  title: string;

  // 이벤트 설명
  @IsString()
  description: string

  // 로그인 일수, 수량 등 "conditions":{"loginDays":3}
  @IsObject()
  conditions: Record<string, any>;

  // 상태
  @IsBoolean()
  status: false;
  
  // 기간
  @IsString()
  startDate: string;
  @IsString()
  endDate: string;
  
  // 등록자 
  @IsString()
  creator: string
}
