import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { AidType } from '@island.is/financial-aid/shared/lib'

export class CreateDeductionFactorsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description!: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly amount: number
}
