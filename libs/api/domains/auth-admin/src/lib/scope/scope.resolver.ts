import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'
import { ISLAND_IS_CATEGORY } from '@island.is/auth-api-lib'
import { CmsContentfulService } from '@island.is/cms'

import { Scope } from './models/scope.model'
import { ScopeClient } from './models/scope-client.model'
import { ScopeUser } from './models/scope-user.model'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeUserInput } from './dto/create-scope-user.input'
import { UpdateScopeUsersInput } from './dto/update-scope-users.input'
import { ScopeService } from './scope.service'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopeInput } from './dto/scope.input'
import { ScopeClientsInput } from './dto/scope-clients.input'
import { ScopeUsersInput } from './dto/scope-users.input'
import { ScopeEnvironment } from './models/scope-environment.model'
import { ScopesInput } from './dto/scopes.input'
import { ScopesByTenantsInput } from './dto/scopes-by-tenants.input'
import { ScopesPayload } from './dto/scopes.payload'
import { ScopesByTenantsPayload } from './dto/scopes-by-tenants.payload'
import { AdminPatchScopeInput } from './dto/patch-scope.input'
import { PublishScopeInput } from './dto/publish-scope.input'
import { ScopeCategory } from './models/scope-category.model'
import { ScopeTag } from './models/scope-tag.model'

@UseGuards(IdsUserGuard)
@Resolver(() => Scope)
export class ScopeResolver {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly cmsContentfulService: CmsContentfulService,
  ) {}

  @Mutation(() => [CreateScopeResponse], {
    name: 'createAuthAdminScope',
  })
  createScope(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateScopeInput })
    input: CreateScopeInput,
  ): Promise<CreateScopeResponse[]> {
    return this.scopeService.createScope(user, input)
  }

  @Mutation(() => [ScopeEnvironment], {
    name: 'patchAuthAdminScope',
  })
  patchScope(
    @CurrentUser() user: User,
    @Args('input', { type: () => AdminPatchScopeInput })
    input: AdminPatchScopeInput,
  ): Promise<ScopeEnvironment[]> {
    return this.scopeService.updateScope({ user, input })
  }

  @Mutation(() => ScopeEnvironment, {
    name: 'publishAuthAdminScope',
  })
  publishScope(
    @CurrentUser() user: User,
    @Args('input', { type: () => PublishScopeInput })
    input: PublishScopeInput,
  ): Promise<ScopeEnvironment> {
    return this.scopeService.publishScope(user, input)
  }

  @Query(() => Scope, { name: 'authAdminScope', nullable: true })
  getScope(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopeInput })
    input: ScopeInput,
  ): Promise<Scope | null> {
    return this.scopeService.getScope(user, input)
  }

  @Query(() => ScopesPayload, {
    name: 'authAdminScopes',
  })
  getScopes(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopesInput })
    input: ScopesInput,
  ): Promise<ScopesPayload> {
    return this.scopeService.getScopes(user, input.tenantId)
  }

  @Query(() => ScopesByTenantsPayload, {
    name: 'authAdminScopesByTenants',
  })
  getScopesByTenants(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopesByTenantsInput })
    input: ScopesByTenantsInput,
  ): Promise<ScopesByTenantsPayload> {
    return this.scopeService.getScopesByTenants(user, input.tenantIds)
  }

  @ResolveField('defaultEnvironment', () => ScopeEnvironment)
  resolveDefaultEnvironment(
    @Parent() { environments, scopeName }: Scope,
  ): ScopeEnvironment {
    if (environments.length === 0) {
      throw new Error(`Scope ${scopeName} has no environments`)
    }

    // Depends on the priority order being decided in the service
    return environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() scope: Scope) {
    const availableEnvironments: Set<Environment> = new Set()

    for (const environment of scope.environments) {
      availableEnvironments.add(environment.environment)
    }

    return Array.from(availableEnvironments)
  }

  @Query(() => [ScopeClient], {
    name: 'authAdminScopeClients',
    description: 'Get all clients that use the specified scope',
  })
  getScopeClients(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopeClientsInput })
    input: ScopeClientsInput,
  ): Promise<ScopeClient[]> {
    return this.scopeService.getScopeClients(user, input, input.environment)
  }

  @Query(() => [ScopeCategory], {
    name: 'authAdminScopeCategories',
    description: 'Get available categories for scope categorization',
  })
  async getScopeCategories(
    @CurrentUser() user: User,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang?: string,
  ): Promise<ScopeCategory[]> {
    const language = lang ?? 'is'
    const cmsCategories = await this.cmsContentfulService.getArticleCategories(
      language,
    )

    return [
      ...cmsCategories,
      {
        id: ISLAND_IS_CATEGORY.id,
        title: ISLAND_IS_CATEGORY.title[language === 'en' ? 'en' : 'is'],
        slug: ISLAND_IS_CATEGORY.slug,
        description:
          ISLAND_IS_CATEGORY.description[language === 'en' ? 'en' : 'is'],
      },
    ]
  }

  @Query(() => [ScopeTag], {
    name: 'authAdminScopeTags',
    description: 'Get available tags (delegation scope tags) for scope tagging',
  })
  async getScopeTags(
    @CurrentUser() user: User,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang?: string,
  ): Promise<ScopeTag[]> {
    return this.cmsContentfulService.getDelegationScopeTags(lang ?? 'is')
  }

  @Query(() => [ScopeUser], {
    name: 'authAdminScopeUsers',
    description: 'Get all users with access to a specific scope',
  })
  getScopeUsers(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopeUsersInput })
    input: ScopeUsersInput,
  ): Promise<ScopeUser[]> {
    return this.scopeService.getScopeUsers(
      user,
      input.tenantId,
      input.scopeName,
      input.environment,
    )
  }

  @Mutation(() => ScopeUser, {
    name: 'createAuthAdminScopeUser',
  })
  createScopeUser(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateScopeUserInput })
    input: CreateScopeUserInput,
  ): Promise<ScopeUser> {
    return this.scopeService.createScopeUser(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateAuthAdminScopeUsers',
  })
  updateScopeUsers(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateScopeUsersInput })
    input: UpdateScopeUsersInput,
  ): Promise<boolean> {
    return this.scopeService.updateScopeUsers(user, input)
  }
}
