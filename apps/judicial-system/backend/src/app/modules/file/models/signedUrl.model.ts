import { ApiProperty } from '@nestjs/swagger'

export class SignedUrl {
  @ApiProperty({ type: String })
  url!: string
}
