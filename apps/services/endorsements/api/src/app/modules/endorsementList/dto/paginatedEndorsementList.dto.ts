import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { EndorsementList } from '../endorsementList.model'

export class PaginatedEndorsementListDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [EndorsementList] })
  data!: EndorsementList[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
