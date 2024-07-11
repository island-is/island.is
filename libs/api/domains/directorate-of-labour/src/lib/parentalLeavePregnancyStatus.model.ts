import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePregnancyStatus {
  @Field(() => Boolean)
  hasActivePregnancy!: boolean

  @Field(() => String)
  expectedDateOfBirth!: string
}
