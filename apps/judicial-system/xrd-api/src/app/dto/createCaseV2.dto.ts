import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseType } from '@island.is/judicial-system/types'

export class CreateCaseV2Dto {
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
