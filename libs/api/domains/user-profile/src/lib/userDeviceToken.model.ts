import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserDeviceToken {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  deviceToken!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date
}
