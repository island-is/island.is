import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PregnancyStatus {
  @Field(() => Boolean, { nullable: true })
  hasActivePregnancy?: boolean

  @Field(() => String, { nullable: true })
  pregnancyDueDate?: string | string
}
