import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { CreateDeductionFactors } from '@island.is/financial-aid/shared/lib'

export class CreateAmountDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly aidAmount: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly income: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly personalTaxCredit: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly spousePersonalTaxCredit: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly tax: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly finalAmount: number

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly deductionFactors: CreateDeductionFactors[]

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId: string
}
