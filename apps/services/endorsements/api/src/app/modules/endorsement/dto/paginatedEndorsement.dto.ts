import { ApiProperty } from '@nestjs/swagger'
import { Endorsement } from '../models/endorsement.model'
import { PageInfoDto } from '../../pagination/dto/pageinfo.dto'

export class PaginatedEndorsementDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [Endorsement] })
  data!: Endorsement[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
