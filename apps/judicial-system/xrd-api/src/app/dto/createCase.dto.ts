import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseType, Gender } from '@island.is/judicial-system/types'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly prosecutorNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorsOfficeNationalId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly accusedNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedDOB?: string

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
