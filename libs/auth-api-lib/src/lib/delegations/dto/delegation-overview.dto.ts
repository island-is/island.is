import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AuthDelegationType } from '@island.is/shared/types'

export class DelegationOverviewScopeDto {
  @ApiProperty()
  scopeName!: string

  @ApiProperty()
  displayName!: string

  @ApiPropertyOptional({ nullable: true, type: Date })
  validFrom?: Date | null

  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}

export class DelegationOverviewClientAccessDto {
  @ApiProperty()
  clientId!: string

  @ApiProperty({
    description: 'Whether the delegation can currently be used to log in.',
  })
  hasAccess!: boolean
}

export class DelegationOverviewDelegationDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ enum: AuthDelegationType, enumName: 'AuthDelegationType' })
  type!: AuthDelegationType

  @ApiProperty()
  fromNationalId!: string

  @ApiProperty()
  toNationalId!: string

  @ApiPropertyOptional({
    nullable: true,
    type: Date,
    description: 'The latest expiry of the delegation, null if it has none.',
  })
  validTo?: Date | null

  @ApiProperty({
    description: 'Whether any part of the delegation is currently valid.',
  })
  isActive!: boolean

  @ApiPropertyOptional({
    nullable: true,
    type: Date,
    description:
      'For delegations from the delegation index, when the recipient was last fully reindexed. Null if never.',
  })
  indexedAt?: Date | null

  @ApiProperty({ type: [DelegationOverviewScopeDto] })
  scopes!: DelegationOverviewScopeDto[]

  @ApiProperty({
    type: [DelegationOverviewClientAccessDto],
    description: 'The organization clients the delegation applies to.',
  })
  clients!: DelegationOverviewClientAccessDto[]
}

export class DelegationOverviewClientDto {
  @ApiProperty()
  clientId!: string

  @ApiPropertyOptional({ nullable: true, type: String })
  clientName?: string | null

  @ApiProperty()
  domainName!: string
}

export class DelegationOverviewDto {
  @ApiProperty({ type: [DelegationOverviewClientDto] })
  clients!: DelegationOverviewClientDto[]

  @ApiProperty({ type: [DelegationOverviewDelegationDto] })
  incoming!: DelegationOverviewDelegationDto[]

  @ApiProperty({ type: [DelegationOverviewDelegationDto] })
  outgoing!: DelegationOverviewDelegationDto[]
}
