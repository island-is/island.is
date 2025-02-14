import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class VerifyCardInput {
  @IsString()
  @ApiProperty({
    description: 'Id of the related payment flow being paid',
    type: String,
  })
  paymentFlowId!: string

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
    description: 'Total amount to be paid in ISK (not cents)',
    type: Number,
  })
  amount!: number
}
