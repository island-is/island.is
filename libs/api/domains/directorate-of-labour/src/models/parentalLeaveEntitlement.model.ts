import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveEntitlement {
  @Field(() => Int, { nullable: true })
  independentMonths?: number

  @Field(() => Float, { nullable: true })
  transferableMonths?: number
}
