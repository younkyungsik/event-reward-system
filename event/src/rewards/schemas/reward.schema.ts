import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 보상 등록 API schemas
export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  eventId: string;

  // 생성자
  @Prop({ required: true })
  creator: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
