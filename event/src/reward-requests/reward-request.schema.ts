import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RewardRequest extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  rewardId: string;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILED'] })
  status: 'SUCCESS' | 'FAILED';

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
