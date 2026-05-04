import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from './multi-environment-result.model'

@ObjectType('AuthAdminDeleteEnvironmentResult')
export class DeleteEnvironmentResult {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => [Environment], { nullable: true })
  deletedEnvironments?: Environment[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
