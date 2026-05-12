import { Field, ObjectType } from '@nestjs/graphql'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { ClientEnvironment } from './client-environment.model'

@ObjectType('AuthAdminPatchClientResponse')
export class PatchClientResponse {
  @Field(() => [ClientEnvironment])
  environments!: ClientEnvironment[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
