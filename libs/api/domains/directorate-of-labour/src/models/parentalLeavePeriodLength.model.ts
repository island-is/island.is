import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePeriodLength {
  @Field(() => Int)
  periodLength!: number
}
