import { ApiProperty } from '@nestjs/swagger'

export class GetSignedUrlResponse {
  @ApiProperty()
  url!: string
}
