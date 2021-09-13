import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { UserRole, User as TUser } from '@island.is/judicial-system/types'

import { Institution } from '../institution'

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

  @Field(() => Institution, { nullable: true })
  readonly institution?: Institution

  @Field()
  readonly active!: boolean
}
