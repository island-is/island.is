import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleEmployer {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string
}
