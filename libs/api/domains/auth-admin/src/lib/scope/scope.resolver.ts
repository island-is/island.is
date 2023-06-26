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

import { Scope } from './models/scope.model'
import { CreateScopeInput } from './dto/create-scope.input'
import { ScopeService } from './scope.service'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopeInput } from './dto/scope.input'
import { ScopeEnvironment } from './models/scope-environment.model'
import { ScopesInput } from './dto/scopes.input'
import { ScopesPayload } from './dto/scopes.payload'
import { AdminPatchScopeInput } from './dto/patch-scope.input'
import { PublishScopeInput } from './dto/publish-scope.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Scope)
export class ScopeResolver {
  constructor(private readonly scopeService: ScopeService) {}

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

  @Query(() => Scope, { name: 'authAdminScope' })
  getScope(
    @CurrentUser() user: User,
    @Args('input', { type: () => ScopeInput })
    input: ScopeInput,
  ): Promise<Scope> {
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
}
