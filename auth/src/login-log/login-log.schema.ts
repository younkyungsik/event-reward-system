import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'login-logs' })
export class LoginLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: string; // 예: 'login'

  @Prop({ required: true })
  date: Date; // 일자 단위 구분

  @Prop({ default: () => new Date() })
  timestamp: Date;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
