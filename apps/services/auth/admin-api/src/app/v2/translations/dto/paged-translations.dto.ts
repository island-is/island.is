import { ApiProperty } from '@nestjs/swagger'

import { Translation } from '@island.is/auth-api-lib'

export class PagedTranslationsDto {
  @ApiProperty({ type: [Translation] })
  rows!: Translation[]

  @ApiProperty({ type: Number })
  count!: number
}
