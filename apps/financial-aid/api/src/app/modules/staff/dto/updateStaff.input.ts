import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { StaffRole, UpdateStaff } from '@island.is/financial-aid/shared/lib'

@InputType()
export class UpdateStaffInput implements UpdateStaff {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field({ nullable: true })
  readonly active?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly nationalId?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly roles?: StaffRole[]

  @Allow()
  @Field({ nullable: true })
  readonly nickname?: string

  @Allow()
  @Field({ nullable: true })
  readonly email?: string
}
