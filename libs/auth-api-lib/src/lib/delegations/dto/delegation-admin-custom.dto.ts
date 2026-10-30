import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DelegationDTO } from './delegation.dto'

export class DelegationAdminDelegationDto extends DelegationDTO {
  @ApiPropertyOptional({
    nullable: true,
    type: Date,
    description:
      'For delegations from the delegation index, when the recipient was last fully reindexed. Null if never.',
  })
  indexedAt?: Date | null
}

export class DelegationAdminCustomDto {
  @ApiProperty({
    type: [DelegationAdminDelegationDto],
    nullable: false,
    default: [],
  })
  incoming!: DelegationAdminDelegationDto[]

  @ApiProperty({
    type: [DelegationAdminDelegationDto],
    nullable: false,
    default: [],
  })
  outgoing!: DelegationAdminDelegationDto[]
}
