import { ApiProperty } from '@nestjs/swagger'

import type { SignedUrl as TSignedUrl } from '@island.is/judicial-system/types'

export class SignedUrl implements TSignedUrl {
  @ApiProperty()
  url!: string
}
