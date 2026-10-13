import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'

@ObjectType('AuthAdminUpdateScopeClientsResponse')
export class UpdateScopeClientsResponse {
  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
