import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { nationalIdTransformer } from '../../../transformers'

export class InternalCasesDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Transform(nationalIdTransformer)
  @ApiProperty({ type: String })
  readonly nationalId!: string
}
