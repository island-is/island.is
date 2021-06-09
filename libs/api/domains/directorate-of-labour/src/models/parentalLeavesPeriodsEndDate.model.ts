import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesPeriodsEndDate {
  @Field(() => Float)
  periodEndDate!: number
}
