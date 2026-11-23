import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

import { AppLogin } from '../models/appLogin.model'
import { AppLoginService } from '../services/appLogin.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => AppLogin)
export class AppLoginResolver {
  constructor(private readonly appLoginService: AppLoginService) {}

  @Query(() => [AppLogin], { name: 'authAppLogins' })
  getAppLogins(@CurrentUser() user: User): Promise<AppLogin[]> {
    return this.appLoginService.getAppLogins(user)
  }

  @Mutation(() => Boolean, { name: 'authRevokeAppLogin' })
  revokeAppLogin(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.appLoginService.revokeAppLogin(user, id)
  }
}
