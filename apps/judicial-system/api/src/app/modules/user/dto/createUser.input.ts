import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

@InputType()
export class CreateUserInput {
  @Allow()
  @Field()
  readonly nationalId!: string

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
  @Field(() => UserRole)
  readonly role!: UserRole

  @Allow()
  @Field()
  readonly institutionId!: string

  @Allow()
  @Field(() => Boolean)
  readonly active!: boolean
}
