import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { ApiScopesInput } from '../dto/apiScopes.input'
import { ApiScopeService } from '../services/apiScope.service'
import { ApiScope } from '../models/apiScope.model'
import { ScopeTreeNode } from '../models/scopeTreeNode.model'
import { Domain } from '../models/domain.model'
import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'
import { ISLAND_DOMAIN } from '../services/constants'

@UseGuards(IdsUserGuard)
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

  @Query(() => [ScopeTreeNode], { name: 'authScopeTree' })
  getScopeTree(
    @CurrentUser() user: User,
    @Args('input') input: ApiScopesInput,
  ): Promise<Array<typeof ScopeTreeNode>> {
    return this.apiScope.getScopeTree(user, input)
  }

  @ResolveField('domain', () => Domain, { nullable: true })
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() apiScope: ApiScope & { domainName?: string },
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain | null> {
    const domainName = apiScope.domainName || ISLAND_DOMAIN
    const domain = await domainLoader.load({
      lang,
      domain: domainName,
    })
    return domain
  }
}
