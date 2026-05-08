import { Field, ObjectType } from '@nestjs/graphql'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'

@ObjectType('AuthAdminUpdateScopeUsersResponse')
export class UpdateScopeUsersResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
