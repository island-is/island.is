import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLCustomDelegationGrantType } from './models/custom-delegation-grant.model'
import type { CustomDelegationGrantType } from './models/custom-delegation-grant.model'
import { ScopeEnvironment } from './models/scope-environment.model'

@Resolver(() => ScopeEnvironment)
export class ScopeEnvironmentResolver {
  @ResolveField('customDelegationGrant', () => GraphQLCustomDelegationGrantType)
  resolveCustomDelegationGrant(
    @Parent() scopeEnvironment: ScopeEnvironment,
  ): CustomDelegationGrantType {
    if (scopeEnvironment.allowExplicitDelegationGrant === false) {
      return false
    }
  }
}
