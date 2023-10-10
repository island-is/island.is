import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { UpdateUser, UserRole } from '@island.is/judicial-system/types'

@InputType()
export class UpdateUserInput implements UpdateUser {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field({ nullable: true })
  readonly name?: string

  @Allow()
  @Field({ nullable: true })
  readonly title?: string

  @Allow()
  @Field({ nullable: true })
  readonly mobileNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly email?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly role?: UserRole

  @Allow()
  @Field({ nullable: true })
  readonly institutionId?: string

  @Allow()
  @Field({ nullable: true })
  readonly active?: boolean
}
