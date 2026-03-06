import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { CustomerRecordsItem } from './customerRecordsItem.model'

@ObjectType('FinanceCustomerRecordsPaged')
export class CustomerRecordsPagedCollection extends PaginatedResponse(
  CustomerRecordsItem,
) {}
