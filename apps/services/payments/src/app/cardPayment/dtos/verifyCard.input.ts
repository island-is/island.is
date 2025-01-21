import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class VerifyCardInput {
  @IsString()
  @ApiProperty({
    description:
      'Correlation id for the whole payment from verification to charge',
    type: String,
  })
  correlationId!: string

  @IsString()
  @ApiProperty({
    description: 'If of the related payment flow being paid',
    type: String,
  })
  paymentFlowId!: string

  @IsString()
  @ApiProperty({
    description: 'Callback URL for the 3DS verification',
    type: String,
  })
  verificationCallbackUrl!: string

  @IsNumber()
  @ApiProperty({
    description: 'Card number',
    type: Number,
  })
  cardNumber!: number

  @IsNumber()
  @ApiProperty({
    description: 'Card expiry month',
    type: Number,
  })
  expiryMonth!: number

  @IsNumber()
  @ApiProperty({
    description: 'Card expiry year',
    type: Number,
  })
  expiryYear!: number

  @IsNumber()
  @ApiProperty({
    description: 'Card cvc',
    type: Number,
  })
  cvc!: number

  @IsNumber()
  @ApiProperty({
    description: 'Total amount to be paid',
    type: Number,
  })
  amount!: number
}
