import { ApiProperty } from '@nestjs/swagger'

export class SignedUrl {
  @ApiProperty()
  url!: string
}
