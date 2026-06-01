import { PageInfoDto } from '@island.is/nest/pagination'
import { CustomerDto } from './customer.dto'

export interface CustomersDto {
  customers: Array<CustomerDto>
  pageInfo: PageInfoDto
  totalCount: number
}
