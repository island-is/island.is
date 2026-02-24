import { Parent, Resolver, ResolveField, Args } from '@nestjs/graphql'
import { NotFoundException } from '@nestjs/common'

import type { DelegationScopeDTO } from '@island.is/clients/auth/delegation-api'
import { Loader } from '@island.is/nest/dataloader'

import { ApiScope } from '../models/apiScope.model'
import { Domain } from '../models/domain.model'
import { DelegationScope } from '../models/delegationScope.model'
import { ApiScopeLoader } from '../loaders/apiScope.loader'
import type { ApiScopeDataLoader } from '../loaders/apiScope.loader'
import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'
import { ISLAND_DOMAIN } from '../services/constants'

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

  @ResolveField('apiScope', () => ApiScope, { nullable: true })
  resolveApiScope(
    @Loader(ApiScopeLoader) apiScopeLoader: ApiScopeDataLoader,
    @Parent() delegationScope: DelegationScope,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<ApiScope | null> {
    return apiScopeLoader.load({
      lang,
      domain: delegationScope.domainName,
      name: delegationScope.scopeName,
    })
  }

  @ResolveField('domain', () => Domain)
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() delegationScope: DelegationScope,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain> {
    const domainName = delegationScope.domainName || ISLAND_DOMAIN
    const domain = await domainLoader.load({
      lang,
      domain: domainName,
    })

    if (!domain) {
      throw new NotFoundException(`Could not find domain: ${domainName}`)
    }

    return domain
  }
}
