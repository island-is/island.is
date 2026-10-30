import { IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateServiceInterruptionBannerDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly globalMessage?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorMessage?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly courtMessage?: string
}
