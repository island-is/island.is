import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePeriodEndDate {
  @Field(() => Float)
  periodEndDate!: number
}
