import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentFlowDTO {
  @ApiProperty({
    description: 'The URL where the payment flow will be initiated',
  })
  url!: string
}
