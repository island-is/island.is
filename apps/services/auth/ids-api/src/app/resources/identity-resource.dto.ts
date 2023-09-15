import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Domain, IdentityResourceUserClaim } from '@island.is/auth-api-lib'

export class IdentityResourceDTO {
  @ApiProperty()
  name!: string

  @ApiProperty()
  displayName!: string

  @ApiProperty()
  description!: string

  @ApiProperty({
    example: true,
  })
  showInDiscoveryDocument!: boolean

  @ApiProperty({
    example: true,
  })
  automaticDelegationGrant!: boolean

  @ApiProperty()
  userClaims?: IdentityResourceUserClaim[]

  @ApiProperty({
    example: true,
  })
  enabled!: boolean

  @ApiProperty({
    example: false,
  })
  required!: boolean

  @ApiProperty({
    example: false,
  })
  emphasize!: boolean

  @ApiProperty({
    example: null,
  })
  archived!: Date

  @ApiProperty()
  readonly created!: Date

  @ApiProperty()
  readonly modified?: Date

  @ApiPropertyOptional({ type: () => Domain })
  domain?: Domain
}
