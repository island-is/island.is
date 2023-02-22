import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { Order, PaginationInput } from '@island.is/nest/pagination'

registerEnumType(Order, {
  name: 'Order',
})

@InputType()
export class SessionsInput extends PaginationInput() {
  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => Order, { nullable: true })
  order?: Order

  @Field(() => Date, { nullable: true })
  toDate?: Date

  @Field(() => Date, { nullable: true })
  fromDate?: Date
}
