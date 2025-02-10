import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class DelegationVerificationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean
}
