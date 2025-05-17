import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

// 유저 활동 로그 기록 스키마
@Schema({ timestamps: true })
export class UserActivityLog extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  type: string; // 예: 'login'

  @Prop({ required: true })
  date: Date; // 해당 활동이 발생한 날짜만(테스트용) (시/분/초 제외)
}

export const UserActivityLogSchema = SchemaFactory.createForClass(UserActivityLog);
