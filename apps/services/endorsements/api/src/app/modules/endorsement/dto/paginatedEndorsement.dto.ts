import { ApiProperty } from '@nestjs/swagger'
import { Endorsement } from '../models/endorsement.model'
import { PageInfoDto } from '@island.is/nest/pagination'

export class PaginatedEndorsementDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [Endorsement] })
  data!: Endorsement[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
