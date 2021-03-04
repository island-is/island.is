import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseGender, CaseType } from '@island.is/judicial-system/types'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ enum: CaseType })
  readonly type!: CaseType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber!: string

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
}
