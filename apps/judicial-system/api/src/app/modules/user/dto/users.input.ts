import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

@InputType()
export class UsersQueryInput {
  @Allow()
  @Field(() => [UserRole], { nullable: true })
  readonly role?: UserRole[]
}
