import { PageInfoDto } from '@island.is/nest/pagination'
import { DebtorDto } from './debtor.dto'

export interface DebtorsDto {
  debtors: Array<DebtorDto>
  pageInfo: PageInfoDto
  totalCount: number
}
