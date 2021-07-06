import { ApiProperty } from '@nestjs/swagger'

import { SignedUrl } from '@island.is/financial-aid/shared'

export class SignedUrlModel implements SignedUrl {
  @ApiProperty()
  url: string
  @ApiProperty()
  key: string
}
