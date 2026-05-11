import { ApiProperty } from '@nestjs/swagger'

import { IdpProvider } from '@island.is/auth-api-lib'

export class PagedIdpProvidersDto {
  @ApiProperty({ type: [IdpProvider] })
  rows!: IdpProvider[]

  @ApiProperty({ type: Number })
  count!: number
}
