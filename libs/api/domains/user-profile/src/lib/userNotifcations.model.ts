import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserNotifications {
  @Field(() => ID)
  id!: string

  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  deviceToken!: string

  @Field(() => Boolean)
  isEnabled!: boolean

  @Field(() => Date)
  created!: string

  @Field(() => Date)
  modified!: string
}
