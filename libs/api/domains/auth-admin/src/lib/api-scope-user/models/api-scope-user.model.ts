import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ApiScopeUserEnvironmentData } from './api-scope-user-environment-data.model'

@ObjectType('AuthAdminApiScopeUser')
export class ApiScopeUser {
  @Field(() => String)
  nationalId!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [ApiScopeUserEnvironmentData], { nullable: true })
  environments?: ApiScopeUserEnvironmentData[]
}
