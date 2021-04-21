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
}
