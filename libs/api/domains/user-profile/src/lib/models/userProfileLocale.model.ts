import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfileLocale {
  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => ID)
  nationalId?: string
}
