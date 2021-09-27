import { Field, ObjectType } from '@nestjs/graphql'

import { User, RolesRule, ReturnUrl } from '@island.is/financial-aid/shared/lib'

import { CurrentApplicationModel } from '../application'
import { StaffModel } from '../staff'

@ObjectType()
export class UserModel implements User {
  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Field()
  readonly folder!: string

  @Field(() => String)
  readonly service!: RolesRule

  @Field(() => CurrentApplicationModel, { nullable: true })
  readonly currentApplication?: CurrentApplicationModel

  @Field(() => String)
  readonly returnUrl!: ReturnUrl

  @Field(() => StaffModel, { nullable: true })
  readonly staff?: StaffModel
}
