import { Field, ObjectType } from '@nestjs/graphql'

import { User, RolesRule } from '@island.is/financial-aid/shared'
import { CurrentApplicationModel } from '../application'

@ObjectType()
export class UserModel implements User {
  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly phoneNumber!: string

  @Field()
  readonly folder!: string

  @Field(() => String)
  readonly service!: RolesRule

  @Field(() => CurrentApplicationModel, { nullable: true })
  readonly currentApplication?: CurrentApplicationModel
}
