import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveEntitlement {
  @Field(() => Int)
  independentMonths!: number

  @Field(() => Int)
  transferableMonths!: number
}
