import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@island.is/financial-aid/shared/lib'

export class CreateDirectTaxPaymentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId: string

  @IsNumber()
  @ApiProperty()
  readonly totalSalary: number

  @IsString()
  @ApiProperty()
  readonly payerNationalId: string

  @IsNumber()
  @ApiProperty()
  readonly personalAllowance: number

  @IsNumber()
  @ApiProperty()
  readonly withheldAtSource: number

  @IsNumber()
  @ApiProperty()
  readonly month: number

  @IsNumber()
  @ApiProperty()
  readonly year: number

  @IsEnum(UserType)
  @ApiProperty()
  readonly userType: UserType
}
