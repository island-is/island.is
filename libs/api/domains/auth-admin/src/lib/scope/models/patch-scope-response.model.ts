import { Field, ObjectType } from '@nestjs/graphql'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { ScopeEnvironment } from './scope-environment.model'

@ObjectType('AuthAdminPatchScopeResponse')
export class PatchScopeResponse {
  @Field(() => [ScopeEnvironment])
  environments!: ScopeEnvironment[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
