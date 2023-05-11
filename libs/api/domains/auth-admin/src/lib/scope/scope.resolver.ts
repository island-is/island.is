import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { Scope } from './models/scope.model'
import { CreateScopeInput } from './dto/create-scope.input'
import { ScopeService } from './scope.service'
import { CreateScopeResponse } from './dto/create-scope.response'

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
}
