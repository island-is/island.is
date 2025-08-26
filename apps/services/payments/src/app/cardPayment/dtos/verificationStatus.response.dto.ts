import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class VerificationStatusResponse {
  @ApiProperty()
  @IsBoolean()
  isVerified!: boolean
}
