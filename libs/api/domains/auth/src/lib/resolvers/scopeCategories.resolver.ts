import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { Auth, AuthMiddleware, CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { ScopesApi } from '@island.is/clients/auth/delegation-api'

import { ScopeCategory } from '../models/scopeCategory.model'
import { ScopeTag } from '../models/scopeTag.model'

@UseGuards(IdsUserGuard)
@Resolver()
export class ScopeCategoriesResolver {
  constructor(private scopesApi: ScopesApi) {}

  private scopesApiWithAuth(auth: Auth) {
    return this.scopesApi.withMiddleware(new AuthMiddleware(auth))
  }

  @Query(() => [ScopeCategory], {
    name: 'authScopeCategories',
    description:
      'Get scope categories from CMS with their associated scopes for portal users',
  })
  async getScopeCategories(
    @CurrentUser() user: User,
    @Args('lang', { type: () => String, defaultValue: 'is' }) lang: string,
  ): Promise<ScopeCategory[]> {
    const categories = await this.scopesApiWithAuth(user).scopesControllerFindCategories({
      lang,
    })

    return categories.map(
      (c) =>
        new ScopeCategory({
          ...c,
          scopes: c.scopes || [],
        }),
    )
  }

  @Query(() => [ScopeTag], {
    name: 'authScopeTags',
    description:
      'Get scope tags (life events) from CMS with their associated scopes for portal users',
  })
  async getScopeTags(
    @CurrentUser() user: User,
    @Args('lang', { type: () => String, defaultValue: 'is' }) lang: string,
  ): Promise<ScopeTag[]> {
    const tags = await this.scopesApiWithAuth(user).scopesControllerFindTags({
      lang,
    })

    return tags.map(
      (t) =>
        new ScopeTag({
          ...t,
          scopes: t.scopes || [],
        }),
    )
  }
}
