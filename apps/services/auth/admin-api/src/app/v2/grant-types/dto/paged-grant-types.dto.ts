import { ApiProperty } from '@nestjs/swagger'

import { GrantType } from '@island.is/auth-api-lib'

export class PagedGrantTypesDto {
  @ApiProperty({ type: [GrantType] })
  rows!: GrantType[]

  @ApiProperty({ type: Number })
  count!: number
}
