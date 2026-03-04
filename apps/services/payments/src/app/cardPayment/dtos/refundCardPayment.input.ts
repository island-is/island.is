import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class RefundCardPaymentInput {
  @IsString()
  @ApiProperty({
    description: 'Id of the payment flow to refund',
    type: String,
  })
  paymentFlowId!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Reason for the refund',
    type: String,
  })
  reasonForRefund?: string
}
