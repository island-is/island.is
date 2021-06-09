import { Field, ObjectType } from '@nestjs/graphql'
import { CustomerChargeTypeItem } from './customerChargeTypeItem.model'

@ObjectType()
export class CustomerChargeType {
  @Field(() => [CustomerChargeTypeItem])
  chargeType!: CustomerChargeTypeItem[]
}
