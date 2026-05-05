import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { ApiScopeUserEnvironmentData } from './api-scope-user-environment-data.model'

@ObjectType('AuthAdminApiScopeUser')
export class ApiScopeUser {
  @Field(() => String)
  nationalId!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [ApiScopeUserEnvironmentData], { nullable: true })
  environments?: ApiScopeUserEnvironmentData[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
