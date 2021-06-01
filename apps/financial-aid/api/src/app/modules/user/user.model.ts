import { Field, ObjectType } from '@nestjs/graphql'

import { User } from '@island.is/financial-aid/shared'

@ObjectType()
export class UserModel implements User {
  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly phoneNumber!: string
}
