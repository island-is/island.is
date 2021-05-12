import { Field, ObjectType, Float } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePregnancyStatus {
  @Field(() => Boolean)
  hasActivePregnancy!: boolean

  @Field(() => String)
  expectedDateOfBirth!: String
}
