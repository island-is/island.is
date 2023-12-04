import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { UpdateUser, UserRole } from '@island.is/judicial-system/types'

@InputType()
export class UpdateUserInput implements UpdateUser {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly title!: string

  @Allow()
  @Field()
  readonly mobileNumber!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => String)
  readonly role!: UserRole

  @Allow()
  @Field()
  readonly institutionId!: string

  @Allow()
  @Field()
  readonly active!: boolean
}
