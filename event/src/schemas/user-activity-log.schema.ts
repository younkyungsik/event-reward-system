import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserActivityLogDocument = UserActivityLog & Document;
// user_activity_logs는 Auth DB에 있으므로, event 서버에서 Mongoose multi-connection 설정
@Schema({ collection: 'user_activity_logs' }) // 컬렉션명 명시
export class UserActivityLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: string; // 예: 'login'

  @Prop({ required: true })
  date: Date;
}

export const UserActivityLogSchema = SchemaFactory.createForClass(UserActivityLog);
