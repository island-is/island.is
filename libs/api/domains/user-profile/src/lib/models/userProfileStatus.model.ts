import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfileStatus {
  @Field(() => Boolean)
  hasModifiedDateLate!: boolean

  @Field(() => Boolean)
  hasData!: boolean
}
