import { ApiProperty } from '@nestjs/swagger'

import type { PresignedPost as TPresignedPost } from '@island.is/judicial-system/types'

export class PresignedPost implements TPresignedPost {
  @ApiProperty()
  url!: string

  @ApiProperty()
  fields!: { [key: string]: string }
}
