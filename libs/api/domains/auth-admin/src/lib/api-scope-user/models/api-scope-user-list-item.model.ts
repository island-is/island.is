import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminApiScopeUserListItem')
export class ApiScopeUserListItem {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String)
  email!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]
}
