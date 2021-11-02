import { Field, ObjectType } from '@nestjs/graphql'

import { User, RolesRule } from '@island.is/financial-aid/shared/lib'

import { StaffModel } from '../staff'
import { SpouseModel } from './spouseModel.model'

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

  @Field(() => String, { nullable: true })
  readonly currentApplicationId?: string

  @Field(() => SpouseModel, { nullable: true })
  readonly isSpouse?: SpouseModel

  @Field(() => StaffModel, { nullable: true })
  readonly staff?: StaffModel

  @Field({ nullable: true })
  readonly postalCode?: number
}
