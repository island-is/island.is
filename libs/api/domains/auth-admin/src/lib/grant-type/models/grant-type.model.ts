import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { GrantTypeEnvironmentData } from './grant-type-environment-data.model'

@ObjectType('AuthAdminGrantType')
export class GrantType {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [GrantTypeEnvironmentData], { nullable: true })
  environments?: GrantTypeEnvironmentData[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
