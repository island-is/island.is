import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserDeviceToken {
  @Field(() => ID)
  id!: string

  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  deviceToken!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date
}

// @ObjectType()
// export class UserNotifications {
//   @Field(() => ID, { nullable: true })
//   id?: string

//   @Field(() => ID, { nullable: true })
//   nationalId?: string

//   @Field(() => String, { nullable: true })
//   deviceToken?: string

//   @Field(() => Boolean, { nullable: true })
//   isEnabled?: boolean

//   @Field(() => Date, { nullable: true })
//   created?: Date

//   @Field(() => Date, { nullable: true })
//   modified?: Date
// }
