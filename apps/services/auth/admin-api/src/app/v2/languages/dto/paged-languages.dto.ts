import { ApiProperty } from '@nestjs/swagger'

import { Language } from '@island.is/auth-api-lib'

export class PagedLanguagesDto {
  @ApiProperty({ type: [Language] })
  rows!: Language[]

  @ApiProperty({ type: Number })
  count!: number
}
