import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleEmployer {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string
}
