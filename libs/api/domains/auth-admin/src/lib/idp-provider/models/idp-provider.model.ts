import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { IdpProviderEnvironmentData } from './idp-provider-environment-data.model'

@ObjectType('AuthAdminIdpProvider')
export class IdpProvider {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [IdpProviderEnvironmentData], { nullable: true })
  environments?: IdpProviderEnvironmentData[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
