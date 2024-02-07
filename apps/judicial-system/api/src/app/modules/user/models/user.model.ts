import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

import { Institution } from '../../institution'

registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType()
export class User {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly modified?: string

  @Field({ nullable: true })
  readonly nationalId?: string

  @Field({ nullable: true })
  readonly name?: string

  @Field({ nullable: true })
  readonly title?: string

  @Field({ nullable: true })
  readonly mobileNumber?: string

  @Field(() => UserRole, { nullable: true })
  readonly role?: UserRole

  @Field({ nullable: true })
  readonly email?: string

  @Field(() => Institution, { nullable: true })
  readonly institution?: Institution

  @Field(() => Boolean, { nullable: true })
  readonly active?: boolean

  @Field({ nullable: true })
  readonly latestLogin?: string

  @Field(() => Int, { nullable: true })
  readonly loginCount?: number
}
