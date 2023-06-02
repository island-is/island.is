import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ScopeEnvironment } from './scope-environment.model'

@ObjectType('AuthAdminScope')
export class Scope {
  @Field(() => ID)
  scopeName!: string

  @Field(() => [ScopeEnvironment])
  environments!: ScopeEnvironment[]
}
