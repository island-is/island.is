import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Gender, CaseType } from '@island.is/judicial-system/types'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty()
  readonly policeCaseNumbers!: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorNationalId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly accusedNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: Gender })
  readonly accusedGender?: Gender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly leadInvestigator?: string
}
