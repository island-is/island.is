import { ApiProperty } from '@nestjs/swagger'

export class ScopeRequestableDTO {
  @ApiProperty({
    description: 'Whether an individual can be asked to delegate the scope.',
  })
  individual!: boolean

  @ApiProperty({
    description:
      'Whether a company (through its procuration holders) can be asked to delegate the scope.',
  })
  company!: boolean
}

export class ScopeDelegationSettingsDTO {
  @ApiProperty()
  name!: string

  @ApiProperty()
  domainName!: string

  @ApiProperty({
    type: [String],
    description: 'Delegation types that can give access to the scope.',
  })
  delegationTypes!: string[]

  @ApiProperty({ type: ScopeRequestableDTO })
  requestable!: ScopeRequestableDTO
}

export class ScopeDelegationSettingsResponseDTO {
  @ApiProperty({ type: [ScopeDelegationSettingsDTO] })
  scopes!: ScopeDelegationSettingsDTO[]
}
