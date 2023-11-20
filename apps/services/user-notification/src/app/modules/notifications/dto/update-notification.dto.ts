import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly message?: string;

  @IsOptional()
  @IsBoolean()
  readonly read?: boolean;
}
