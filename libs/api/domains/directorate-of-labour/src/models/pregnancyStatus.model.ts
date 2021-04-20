import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PregnancyStatus {
  @Field(() => Boolean, { nullable: true })
  hasActivePregnancy?: boolean

  @Field(() => String, { nullable: true })
  pregnancyDueDate?: string

  @Field(() => String, { nullable: true })
  errorMessage?: string

  @Field(() => Int, { nullable: true })
  errorCode?: number

  @Field(() => Boolean, { nullable: true })
  hasError?: boolean
}
