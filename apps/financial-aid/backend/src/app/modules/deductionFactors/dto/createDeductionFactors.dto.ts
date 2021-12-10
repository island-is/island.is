import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDeductionFactorsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly amountId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly amount: number
}
