import { ApiProperty } from '@nestjs/swagger'

import { PresignedPost } from '@island.is/financial-aid/shared'

export class PresignedPostModel implements PresignedPost {
  @ApiProperty()
  url: string
}
