import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { HomeCircumstances, Employment } from '@island.is/financial-aid/shared'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly phoneNumber: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly homeCircumstances: HomeCircumstances

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly homeCircumstancesCustom: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly employment: Employment

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly employmentCustom: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly student: boolean

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly studentCustom: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly usePersonalTaxCredit: boolean

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly bankNumber: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ledger: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly accountNumber: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly interview: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly hasIncome: boolean
}
