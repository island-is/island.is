import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesEntitlement {
  @Field(() => Float)
  independentMonths!: number

  @Field(() => Float)
  transferableMonths!: number
}
