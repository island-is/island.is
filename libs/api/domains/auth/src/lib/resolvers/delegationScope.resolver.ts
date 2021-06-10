import { Parent, Resolver, ResolveField } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
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

  @ResolveField('displayName')
  resolveDisplayName(@Parent() delegationScope: DelegationScopeDTO): string {
    // TODO: missing implementation in auth-public-api
    const split = delegationScope.scopeName.split('/')
    return split[split.length - 1]
  }
}
