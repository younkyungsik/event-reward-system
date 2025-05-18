import { IsMongoId } from 'class-validator';

export class CreateRewardRequestDto {
  @IsMongoId()
  eventId: string;

  @IsMongoId()
  rewardId: string;
}
