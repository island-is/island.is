import { Field, ObjectType } from '@nestjs/graphql'

import { Scope } from '../models/scope.model'

@ObjectType('AuthAdminScopesByTenant')
export class ScopesByTenant {
  @Field(() => String)
  tenantId!: string

  @Field(() => [Scope])
  data!: Scope[]
}

@ObjectType('AuthAdminScopesByTenantsPayload')
export class ScopesByTenantsPayload {
  @Field(() => [ScopesByTenant])
  data!: ScopesByTenant[]
}
