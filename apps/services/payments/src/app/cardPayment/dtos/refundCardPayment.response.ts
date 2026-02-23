import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsEnum } from 'class-validator'

export enum RefundMethod {
  FJS_CHARGE_DELETED = 'fjs_charge_deleted',
  PAYMENT_GATEWAY = 'payment_gateway',
}

export class RefundCardPaymentResponse {
  @ApiProperty({
    description: 'Indicates if the payment refund was successful',
    type: Boolean,
  })
  @IsBoolean()
  success!: boolean

  @ApiProperty({
    description:
      'How the refund was processed: via FJS charge deletion or payment gateway',
    enum: RefundMethod,
  })
  @IsEnum(RefundMethod)
  refundMethod!: RefundMethod

  @ApiProperty({
    description: 'Message describing the refund result',
    type: String,
  })
  @IsString()
  message!: string
}
