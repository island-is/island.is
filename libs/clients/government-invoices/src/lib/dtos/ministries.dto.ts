import { PageInfoDto } from '@island.is/nest/pagination'
import { MinistryDto } from './ministry.dto'

export interface MinistriesDto {
  ministries: Array<MinistryDto>
  pageInfo: PageInfoDto
  totalCount: number
}
