import { ObjectType } from '@nestjs/graphql'
import { PageInfoDto } from '@island.is/nest/pagination'
import { CustomerRecordsItem } from './customerRecordsItem.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('FinanceCustomerRecordsPaged')
export class CustomerRecordsPagedCollection {
  @CacheField(() => [CustomerRecordsItem])
  data!: CustomerRecordsItem[]

  @CacheField(() => PageInfoDto)
  pageInfo!: PageInfoDto
}
