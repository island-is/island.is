import { Transform } from 'class-transformer'
import { IsOptional, IsString, Length, MaxLength } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { nationalIdTransformer } from '../../../transformers'

export class CreateVictimDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  name?: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  nationalId?: string
}
