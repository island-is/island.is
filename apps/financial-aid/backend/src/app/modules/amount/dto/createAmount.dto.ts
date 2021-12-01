import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

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
}
