import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { StaffRole, UpdateStaff } from '@island.is/financial-aid/shared/lib'

@InputType()
export class UpdateStaffInput implements UpdateStaff {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly active!: boolean

  @Allow()
  @Field()
  readonly nationalId?: string

  @Allow()
  @Field(() => [String])
  readonly roles?: StaffRole[]

  @Allow()
  @Field()
  readonly nickname?: string
}
