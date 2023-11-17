import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceCustomerChargeTypeItem')
export class CustomerChargeTypeItem {
  @Field()
  id!: string

  @Field()
  name!: string
}
