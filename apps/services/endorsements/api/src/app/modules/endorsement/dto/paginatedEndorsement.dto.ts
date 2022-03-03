import { ApiProperty } from '@nestjs/swagger'

import { PageInfoDto } from '@island.is/nest/pagination'

import { Endorsement } from '../models/endorsement.model'

export class PaginatedEndorsementDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [Endorsement] })
  data!: Endorsement[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
