import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CreateStaff, StaffRole } from '@island.is/financial-aid/shared/lib'

@InputType()
export class CreateStaffInput implements CreateStaff {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => [String])
  readonly roles!: StaffRole[]
}
