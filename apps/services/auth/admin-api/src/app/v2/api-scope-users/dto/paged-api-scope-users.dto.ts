import { ApiProperty } from '@nestjs/swagger'

import { ApiScopeUser } from '@island.is/auth-api-lib'

export class PagedApiScopeUsersDto {
  @ApiProperty({ type: [ApiScopeUser] })
  rows!: ApiScopeUser[]

  @ApiProperty({ type: Number })
  count!: number
}
