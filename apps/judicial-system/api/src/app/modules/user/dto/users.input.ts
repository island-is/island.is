import { Allow, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

@InputType()
export class UsersQueryInput {
  @Allow()
  @IsOptional()
  @Field(() => [UserRole], { nullable: true })
  readonly role?: UserRole[]
}
