import { Field, ObjectType } from '@nestjs/graphql'

import { User } from '@island.is/financial-aid/shared'
import { ApplicationModel } from '../application'

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
  readonly hasAppliedForPeriod?: boolean

  @Field(() => ApplicationModel, { nullable: true })
  readonly activeApplication?: ApplicationModel
}
