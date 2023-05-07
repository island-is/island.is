import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { Scope } from './models/scope.model'
import { CreateScopeInput } from './dto/create-scope.input'
import { ScopeService } from './scope.service'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopesInput } from './dto/scopes.input'
import { ScopesPayload } from './dto/scopes.payload'

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
}
