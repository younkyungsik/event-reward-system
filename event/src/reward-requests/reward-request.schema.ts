import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  rewardId: Types.ObjectId;

  @Prop({ required: true, enum: ['PENDING', 'SUCCESS', 'FAILED'] })
  status: string;

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
