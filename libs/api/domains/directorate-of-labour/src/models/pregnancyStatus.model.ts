import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PregnancyStatus {
  @Field(() => Boolean)
  hasActivePregnancy!: boolean

  @Field(() => String)
  expectedDateOfBirth!: string
}
