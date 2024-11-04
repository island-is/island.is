import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentFlowDTO {
  @ApiProperty()
  url!: string
}
