import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  Auth,
  AuthMiddleware,
  CurrentUser,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import {
  ScopesApi,
  ScopesControllerFindCategoriesDirectionEnum,
  ScopesControllerFindTagsDirectionEnum,
  MeDelegationsControllerFindAllDirectionEnum,
} from '@island.is/clients/auth/delegation-api'

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
    @Args('direction', {
      type: () => MeDelegationsControllerFindAllDirectionEnum,
      nullable: true,
    })
    direction?: MeDelegationsControllerFindAllDirectionEnum,
  ): Promise<ScopeCategory[]> {
    const categories = await this.scopesApiWithAuth(
      user,
    ).scopesControllerFindCategories({
      lang,
      direction:
        direction as unknown as ScopesControllerFindCategoriesDirectionEnum,
    })

    return categories as ScopeCategory[]
  }

  @Query(() => [ScopeTag], {
    name: 'authScopeTags',
    description:
      'Get scope tags (delegation scope tags) from CMS with their associated scopes for portal users.',
  })
  async getScopeTags(
    @CurrentUser() user: User,
    @Args('lang', { type: () => String, defaultValue: 'is' }) lang: string,
    @Args('direction', {
      type: () => MeDelegationsControllerFindAllDirectionEnum,
      nullable: true,
    })
    direction?: MeDelegationsControllerFindAllDirectionEnum,
  ): Promise<ScopeTag[]> {
    const tags = await this.scopesApiWithAuth(user).scopesControllerFindTags({
      lang,
      direction: direction as unknown as ScopesControllerFindTagsDirectionEnum,
    })

    return tags as ScopeTag[]
  }

  @Query(() => ScopeCategory, {
    name: 'authScopeCategoryBySlug',
    nullable: true,
    description:
      'Get a single scope category by slug from CMS with its associated scopes for portal users',
  })
  async getScopeCategoryBySlug(
    @CurrentUser() user: User,
    @Args('slug', { type: () => String }) slug: string,
    @Args('lang', { type: () => String, defaultValue: 'is' }) lang: string,
    @Args('direction', {
      type: () => MeDelegationsControllerFindAllDirectionEnum,
      nullable: true,
    })
    direction?: MeDelegationsControllerFindAllDirectionEnum,
  ): Promise<ScopeCategory | null> {
    const categories = await this.scopesApiWithAuth(
      user,
    ).scopesControllerFindCategories({
      lang,
      direction:
        direction as unknown as ScopesControllerFindCategoriesDirectionEnum,
    })

    return (categories as ScopeCategory[]).find((c) => c.slug === slug) ?? null
  }

  @Query(() => ScopeTag, {
    name: 'authScopeTagBySlug',
    nullable: true,
    description:
      'Get a single scope tag by slug from CMS with its associated scopes for portal users.',
  })
  async getScopeTagBySlug(
    @CurrentUser() user: User,
    @Args('slug', { type: () => String }) slug: string,
    @Args('lang', { type: () => String, defaultValue: 'is' }) lang: string,
    @Args('direction', {
      type: () => MeDelegationsControllerFindAllDirectionEnum,
      nullable: true,
    })
    direction?: MeDelegationsControllerFindAllDirectionEnum,
  ): Promise<ScopeTag | null> {
    const tags = await this.scopesApiWithAuth(user).scopesControllerFindTags({
      lang,
      direction: direction as unknown as ScopesControllerFindTagsDirectionEnum,
    })

    return (tags as ScopeTag[]).find((t) => t.slug === slug) ?? null
  }
}
