import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class VerificationStatusResponse {
  @ApiProperty()
  @IsBoolean()
  isVerified!: boolean

  @ApiProperty({
    description:
      'True when the 3DS verification for the current attempt failed',
  })
  @IsBoolean()
  isFailed!: boolean
}
