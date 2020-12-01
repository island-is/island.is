import { Field, ID, ObjectType } from '@nestjs/graphql'

import { User as TUser, UserRole } from '@island.is/judicial-system/types'

@ObjectType()
export class User implements TUser {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly title!: string

  @Field()
  readonly mobileNumber!: string

  @Field()
  readonly email!: string

  @Field(() => String)
  readonly role!: UserRole

  @Field()
  readonly active!: boolean
}
