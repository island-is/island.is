import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { ReturnEndorsementList } from '../endorsementList.model'

export class PaginatedEndorsementListDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [ReturnEndorsementList] })
  data!: ReturnEndorsementList[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
