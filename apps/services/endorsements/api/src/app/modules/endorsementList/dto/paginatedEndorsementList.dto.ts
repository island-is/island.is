import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { EndorsementListDto } from './endorsementList.dto'

export class PaginatedEndorsementListDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [EndorsementListDto] })
  data!: EndorsementListDto[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}



