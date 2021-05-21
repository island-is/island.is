import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveEntitlement {
  @Field(() => Float)
  independentMonths!: number

  @Field(() => Float)
  transferableMonths!: number
}
