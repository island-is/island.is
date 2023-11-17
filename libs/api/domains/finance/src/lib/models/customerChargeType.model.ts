import { Field, ObjectType } from '@nestjs/graphql'
import { CustomerChargeTypeItem } from './customerChargeTypeItem.model'

@ObjectType('FinanceCustomerChargeType')
export class CustomerChargeType {
  @Field(() => [CustomerChargeTypeItem])
  chargeType!: CustomerChargeTypeItem[]
}
