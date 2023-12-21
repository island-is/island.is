import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

import { CreateLoginRestrictionInput } from '../dto/loginRestriction.input'
import { LoginRestriction } from '../models/loginRestriction.model'
import { LoginRestrictionService } from '../services/loginRestriction.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => LoginRestriction)
export class LoginRestrictionResolver {
  private loginRestriction: Record<string, LoginRestriction> = {}

  constructor(
    private readonly loginRestrictionsService: LoginRestrictionService,
  ) {}

  @Query(() => LoginRestriction, {
    name: 'authLoginRestriction',
  })
  getLoginRestriction(@CurrentUser() user: User): Promise<LoginRestriction> {
    return this.loginRestrictionsService.getLoginRestriction(user)
  }

  @Mutation(() => LoginRestriction, { name: 'createAuthLoginRestriction' })
  createLoginRestriction(
    @CurrentUser() user: User,
    @Args('input') input: CreateLoginRestrictionInput,
  ): Promise<LoginRestriction> {
    return this.loginRestrictionsService.createLoginRestriction(
      user,
      input.until,
    )
  }

  @Mutation(() => Boolean, { name: 'removeAuthLoginRestriction' })
  removeLoginRestriction(@CurrentUser() user: User): Promise<boolean> {
    return this.loginRestrictionsService.removeLoginRestriction(user)
  }
}
