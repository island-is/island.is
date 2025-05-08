import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ChargeCardInput {
  @IsString()
  @ApiProperty({
    description: 'Id of the related payment flow being paid',
    type: String,
  })
  paymentFlowId!: string

  @IsString()
  @ApiProperty({
    description: 'Card number',
    type: String,
  })
  cardNumber!: string

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

  @IsString()
  @ApiProperty({
    description: 'Card cvc',
    type: String,
  })
  cvc!: string
}
