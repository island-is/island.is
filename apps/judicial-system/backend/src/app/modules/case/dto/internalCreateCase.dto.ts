import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseType, Gender } from '@island.is/judicial-system/types'

export class InternalCreateCaseDto {
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
  @ApiPropertyOptional({ enum: Gender })
  readonly accusedGender?: Gender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly citizenship?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly leadInvestigator?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly isHeightenedSecurityLevel?: boolean
}
