import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { ApiScopesInput } from '../dto/apiScopes.input'
import { ApiScopeService } from '../services/apiScope.service'
import { ApiScope } from '../models/apiScope.model'
import { ScopeTreeNode } from '../models/scopeTreeNode.model'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Resolver(() => ApiScope)
export class ApiScopeResolver {
  constructor(private apiScope: ApiScopeService) {}

  @Query(() => [ApiScope], {
    name: 'authApiScopes',
    deprecationReason: 'Should use authScopeTree instead.',
  })
  getApiScopes(
    @CurrentUser() user: User,
    @Args('input') input: ApiScopesInput,
  ): Promise<ApiScope[]> {
    return this.apiScope.getApiScopes(user, input)
  }

  @FeatureFlag(Features.outgoingDelegationsV2)
  @Query(() => [ScopeTreeNode], { name: 'authScopeTree' })
  getScopeTree(
    @CurrentUser() user: User,
    @Args('input') input: ApiScopesInput,
  ): Promise<Array<typeof ScopeTreeNode>> {
    return this.apiScope.getScopeTree(user, input)
  }
}
