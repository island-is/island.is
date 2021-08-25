import { Field, ObjectType } from '@nestjs/graphql'

import { User } from '@island.is/financial-aid/shared'
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

  @Field()
  readonly service!: 'osk' | 'veita'

  @Field()
  readonly municipalityId?: 'hfj'

  @Field(() => CurrentApplicationModel, { nullable: true })
  readonly currentApplication?: CurrentApplicationModel
}
