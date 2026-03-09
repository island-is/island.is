import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ApplePaySessionResponse {
  @IsString()
  @ApiProperty({
    description: 'Apple Pay session',
    type: String,
  })
  session!: string
}
