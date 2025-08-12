import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum } from 'class-validator'
import { PaymentMethod, PaymentStatus } from '../../../types'

export class GetPaymentFlowDTO {
  @ApiProperty({
    description: 'Unique identifier for the payment flow',
    type: String,
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    description: 'Product title to display to the payer',
    type: String,
  })
  productTitle!: string

  @ApiProperty({
    description:
      'Price of the product being paid for, can be combined of multiple prices based on the product ids of the payment flow',
    type: Number,
  })
  productPrice!: number

  @ApiProperty({
    description: 'National id of the payer, can be a company or an individual',
    type: String,
  })
  payerNationalId!: string

  @ApiProperty({
    description: 'Name of the payer',
    type: String,
  })
  payerName!: string

  @ApiPropertyOptional({
    description:
      'Optional identifier for an invoice associated with the payment flow',
    type: String,
  })
  existingInvoiceId?: string

  @ApiProperty({
    description: 'List of allowed payment methods for this payment flow',
    type: [String],
    example: ['card', 'invoice'],
    enum: PaymentMethod,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PaymentMethod, { each: true })
  availablePaymentMethods!: PaymentMethod[]

  @ApiProperty({
    description:
      'URL callback to be called on payment update events like when the user requests to create invoice rather than directly paying',
    type: String,
  })
  onUpdateUrl!: string

  @ApiProperty({
    description: 'Identifier for the organization initiating the payment flow',
    type: String,
  })
  organisationId!: string

  @ApiProperty({
    description: 'Status of the payment: unpaid, pending invoice or paid',
    enum: PaymentStatus,
  })
  paymentStatus!: PaymentStatus

  @ApiPropertyOptional({
    description:
      'Arbitrary JSON data that will be returned on in callbacks (e.g. onSuccess, onUpdate)',
    type: Object,
    example: { customData: 'value' },
  })
  metadata?: object

  @ApiPropertyOptional({
    description:
      'The URL to redirect the user to after the payment flow has been completed or cancelled',
    type: String,
  })
  returnUrl?: string

  @ApiPropertyOptional({
    description:
      'If user should be redirected to the returnUrl after the payment flow has been completed successfully',
    type: Boolean,
  })
  redirectToReturnUrlOnSuccess?: boolean

  @ApiProperty({
    description: 'Last updated at',
    type: Date,
  })
  updatedAt!: Date

  @ApiPropertyOptional()
  cancelUrl?: string
}
