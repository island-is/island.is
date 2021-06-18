import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  IsBoolean,
  IsObject,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator'

export class ChargeResponseData {
  @ApiProperty()
  @Expose()
  @IsString()
  returnUrl!: string
}

export class CreatePaymentResponseDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  success!: boolean

  @ApiProperty()
  @Expose()
  @IsString()
  returnUrl!: string | null
}
