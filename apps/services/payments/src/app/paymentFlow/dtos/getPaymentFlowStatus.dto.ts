import { ApiProperty } from '@nestjs/swagger'
import { PaymentStatus } from '../../../types'

export class GetPaymentFlowStatusDTO {
  @ApiProperty({
    description: 'Unique identifier for the payment flow',
    type: String,
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    description: 'Status of the payment: unpaid, pending invoice or paid',
    enum: PaymentStatus,
  })
  paymentStatus!: PaymentStatus

  @ApiProperty({
    description: 'Last updated at',
    type: Date,
  })
  updatedAt!: Date
}
