import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  readonly read?: boolean;
}
