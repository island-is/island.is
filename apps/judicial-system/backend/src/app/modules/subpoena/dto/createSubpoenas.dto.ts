import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { SubpoenaType } from '@island.is/judicial-system/types'

export class CreateSubpoenasDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'IDs of defendants to create subpoenas for',
  })
  readonly defendantIds!: string[]

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly arraignmentDate?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly location?: string
}
