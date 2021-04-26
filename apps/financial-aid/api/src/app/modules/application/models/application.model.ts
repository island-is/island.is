import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Application } from '@island.is/financial-aid/types'

@ObjectType()
export class ApplicationModel implements Application {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly phoneNumber!: string

  @Field()
  readonly email!: string
}
