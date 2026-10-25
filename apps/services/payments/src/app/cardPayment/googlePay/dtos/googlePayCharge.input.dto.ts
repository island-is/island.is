import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, MaxLength } from 'class-validator'

export class GooglePayChargeInput {
  @IsString()
  @Length(1, 128)
  @ApiProperty({ description: 'Payment flow ID', type: String })
  paymentFlowId!: string

  @IsString()
  @MaxLength(16384)
  @ApiProperty({
    description:
      'The paymentMethodData.tokenizationData.token string from Google Pay, forwarded unmodified',
    type: String,
  })
  token!: string
}
