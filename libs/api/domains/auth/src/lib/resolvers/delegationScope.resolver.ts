import { Parent, Resolver, ResolveField, Args } from '@nestjs/graphql'

import type { DelegationScopeDTO } from '@island.is/clients/auth/public-api'

import { ApiScope, DelegationScope } from '../models'
import { Loader } from '@island.is/nest/dataloader'
import { ApiScopeLoader } from '../loaders/apiScope.loader'
import type { ApiScopeDataLoader } from '../loaders/apiScope.loader'

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
}
