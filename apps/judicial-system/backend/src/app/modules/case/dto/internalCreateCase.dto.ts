import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseGender, CaseType } from '@island.is/judicial-system/types'

export class InternalCreateCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber!: string

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
  @ApiPropertyOptional({ enum: CaseGender })
  readonly accusedGender?: CaseGender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly leadInvestigator?: string
}
