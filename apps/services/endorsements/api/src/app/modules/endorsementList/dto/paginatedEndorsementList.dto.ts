import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '../../../../../../../../../libs/nest/pagination/src/lib/dto/pageinfo.dto'
import { EndorsementList } from '../endorsementList.model'

export class PaginatedEndorsementListDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [EndorsementList] })
  data!: EndorsementList[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
