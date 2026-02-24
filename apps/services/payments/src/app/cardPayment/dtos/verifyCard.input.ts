import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class VerifyCardInput {
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
}
