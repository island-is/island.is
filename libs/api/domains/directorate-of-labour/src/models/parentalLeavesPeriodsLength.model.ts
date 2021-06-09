import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesPeriodsLength {
  @Field(() => Int)
  periodLength!: number
}
