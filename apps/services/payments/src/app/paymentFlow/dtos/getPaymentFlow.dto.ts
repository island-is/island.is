import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum } from 'class-validator'
import { PaymentMethod } from '../../../types'

export class GetPaymentFlowDTO {
  @ApiProperty({
    description: 'Unique identifier for the payment flow',
    type: String,
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    description: 'Identifier for the product being paid for',
    type: String,
  })
  productId!: string

  @ApiPropertyOptional({
    description:
      'Optional identifier for an invoice associated with the payment flow',
    type: String,
  })
  invoiceId?: string

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
    description: 'URL callback to be called on a successful payment',
    type: String,
  })
  onSuccessUrl!: string

  @ApiPropertyOptional({
    description:
      'URL callback to be called on payment update events like when the user requests to create invoice rather than directly paying',
    type: String,
  })
  onUpdateUrl?: string

  @ApiProperty({
    description: 'URL callback to be called on payment error events',
    type: String,
  })
  onErrorUrl!: string

  @ApiProperty({
    description: 'Identifier for the organization initiating the payment flow',
    type: String,
  })
  organisationId!: string

  @ApiPropertyOptional({
    description:
      'Arbitrary JSON data that will be returned on in callbacks (e.g. onSuccess, onUpdate)',
    type: Object,
    example: { customData: 'value' },
  })
  metadata?: object
}
