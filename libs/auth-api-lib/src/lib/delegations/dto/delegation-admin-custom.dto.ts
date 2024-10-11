import { ApiProperty } from '@nestjs/swagger'

import { DelegationDTO } from './delegation.dto'

export class DelegationAdminCustomDto {
  @ApiProperty({ type: [DelegationDTO], nullable: false, default: [] })
  incoming!: DelegationDTO[]

  @ApiProperty({ type: [DelegationDTO], nullable: false, default: [] })
  outgoing!: DelegationDTO[]
}
