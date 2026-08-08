import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminGrantTypeListItem')
export class GrantTypeListItem {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [Environment], { nullable: true })
  archivedEnvironments?: Environment[]

  @Field(() => String)
  description!: string
}
