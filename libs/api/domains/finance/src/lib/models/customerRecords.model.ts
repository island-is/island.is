import { Field, ObjectType } from '@nestjs/graphql'
import { CustomerRecordsItem } from './customerRecordsItem.model'

@ObjectType('FinanceCustomerRecords')
export class CustomerRecords {
  @Field(() => [CustomerRecordsItem], { nullable: true })
  records?: CustomerRecordsItem[]
}
