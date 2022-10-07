import { Parent, Resolver, ResolveField } from '@nestjs/graphql'

import type { DelegationScopeDTO } from '@island.is/clients/auth-public-api'

import { DelegationScope } from '../models'

@Resolver(() => DelegationScope)
export class DelegationScopeResolver {
  @ResolveField('id')
  resolveId(@Parent() delegationScope: DelegationScopeDTO): string {
    return `${delegationScope.delegationId}_${delegationScope.scopeName}`
  }

  @ResolveField('name')
  resolveName(@Parent() delegationScope: DelegationScopeDTO): string {
    return delegationScope.scopeName
  }
}
