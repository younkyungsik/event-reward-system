import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'login-logs' })
export class LoginLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
