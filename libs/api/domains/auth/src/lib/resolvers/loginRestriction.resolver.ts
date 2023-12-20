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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => LoginRestriction)
export class LoginRestrictionResolver {
  private loginRestriction: Record<string, LoginRestriction> = {}

  @Query(() => LoginRestriction, {
    name: 'authLoginRestriction',
  })
  getLoginRestriction(@CurrentUser() user: User): Promise<LoginRestriction> {
    const restriction = this.loginRestriction[user.nationalId]

    return Promise.resolve(
      restriction || {
        restricted: false,
      },
    )
  }

  @Mutation(() => LoginRestriction, { name: 'createAuthLoginRestriction' })
  createLoginRestriction(
    @CurrentUser() user: User,
    @Args('input') input: CreateLoginRestrictionInput,
  ): Promise<LoginRestriction> {
    this.loginRestriction[user.nationalId] = {
      restricted: true,
      until: input.until,
    }

    return Promise.resolve(this.loginRestriction[user.nationalId])
  }

  @Mutation(() => Boolean, { name: 'removeAuthLoginRestriction' })
  removeLoginRestriction(@CurrentUser() user: User): Promise<boolean> {
    delete this.loginRestriction[user.nationalId]

    return Promise.resolve(true)
  }
}
