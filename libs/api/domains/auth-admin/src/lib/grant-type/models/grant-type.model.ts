import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminGrantType')
export class GrantType {
  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => Date, { nullable: true })
  archived?: Date

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]
}
