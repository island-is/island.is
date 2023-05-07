import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ScopeEnvironment } from './scope-environment.model'

@ObjectType('AuthAdminScope')
export class Scope {
  @Field(() => [ScopeEnvironment])
  environments!: ScopeEnvironment[]

  @Field(() => [Environment])
  availableEnvironments?: Environment[]

  @Field(() => ScopeEnvironment)
  defaultEnvironment?: ScopeEnvironment
}
