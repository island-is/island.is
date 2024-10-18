import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { CreateDeductionFactorsDto } from '../../deductionFactors/dto'

export class CreateAmountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly aidAmount: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly income?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly childrenAidAmount?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly decemberAidAmount?: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly personalTaxCredit: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly spousePersonalTaxCredit?: number

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
  readonly deductionFactors?: CreateDeductionFactorsDto[]
}
