import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'
import { PageInfoDto } from '../../pagination/dto/pageinfo.dto'
import { EndorsementList } from '../endorsementList.model'

export class PaginatedEndorsementListDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [EndorsementList] })
  data!: EndorsementList[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
