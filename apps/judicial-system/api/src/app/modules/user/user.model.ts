import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

import { Institution } from '../institution'

registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType()
export class User {
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

  @Field(() => UserRole)
  readonly role!: UserRole

  @Field()
  readonly email!: string

  @Field(() => Institution, { nullable: true })
  readonly institution?: Institution

  @Field()
  readonly active!: boolean
}
