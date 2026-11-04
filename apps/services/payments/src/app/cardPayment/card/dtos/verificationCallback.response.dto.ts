import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class VerificationCallbackResponse {
  @ApiProperty()
  @IsString()
  paymentFlowId!: string
}
