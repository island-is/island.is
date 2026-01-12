import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetVerificationStatus {
  @IsString()
  @Length(36, 36)
  @ApiProperty()
  readonly paymentFlowId!: string
}
