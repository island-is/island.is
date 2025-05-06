import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateInvoiceInput {
  @IsString()
  @ApiProperty({
    description:
      'Id of the related payment flow being paid later with an invoice',
    type: String,
  })
  paymentFlowId!: string
}
