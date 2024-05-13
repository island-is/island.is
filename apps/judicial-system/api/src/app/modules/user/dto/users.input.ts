import { Allow, IsArray, IsEnum, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

@InputType()
export class UsersQueryInput {
  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @Field(() => [UserRole], { nullable: true })
  readonly role?: UserRole[]
}
