import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsString } from 'class-validator'

export class PaymentStatusResponseDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  fulfilled!: boolean

  @ApiProperty()
  @Expose()
  @IsString()
  paymentUrl!: string
}
