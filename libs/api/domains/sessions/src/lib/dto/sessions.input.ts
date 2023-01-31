import { Field, InputType } from '@nestjs/graphql'

import { PaginationInput } from '@island.is/nest/pagination'

@InputType()
export class SessionsInput extends PaginationInput() {
  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => Date, { nullable: true })
  toDate?: Date

  @Field(() => Date, { nullable: true })
  fromDate?: Date
}
