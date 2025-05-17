import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//이벤트 생성 API Schema
export type EventDocument = Event & Document;

@Schema()
export class Event {
  // 이벤트 조건 및 제목(예: 로그인 3일, 친구 초대 등)
  @Prop({ required: true })
  title: string;

  // 이벤트 설명 (예: 3일 이상 로그인 시 보상 지급)
  description: string; 
  
  // 로그인 일수, 수량 등 "conditions":{"loginDays":3}
  @Prop({ type: Object })
  conditions: Record<string, any>;

  // 상태(활성/비활성)
  @Prop({ type: Boolean })
  status: Boolean;

  // 기간
  @Prop({ required: true })
  startDate: string; 
  @Prop({ required: true })
  endDate: string; 

  // 생성자
  @Prop({ required: true })
  creator: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);
