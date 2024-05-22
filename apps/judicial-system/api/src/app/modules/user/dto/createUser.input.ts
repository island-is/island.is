import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

@InputType()
export class CreateUserInput {
  @Allow()
  @Field(() => String)
  readonly nationalId!: string

  @Allow()
  @Field(() => String)
  readonly name!: string

  @Allow()
  @Field(() => String)
  readonly title!: string

  @Allow()
  @Field(() => String)
  readonly mobileNumber!: string

  @Allow()
  @Field(() => String)
  readonly email!: string

  @Allow()
  @Field(() => UserRole)
  readonly role!: UserRole

  @Allow()
  @Field(() => ID)
  readonly institutionId!: string

  @Allow()
  @Field(() => Boolean)
  readonly active!: boolean

  @Allow()
  @Field(() => Boolean)
  readonly canConfirmIndictment!: boolean
}
