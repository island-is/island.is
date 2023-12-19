import { UseGuards } from '@nestjs/common'
import { Mutation, Query, Resolver } from '@nestjs/graphql'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

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

  @Query(() => Date, { name: 'getAuthLoginRestrictionDate' })
  getLoginRestrictionDate(@CurrentUser() user: User): Date {
    return this.getRestrictionDate()
  }

  @Mutation(() => LoginRestriction, { name: 'setAuthLoginRestriction' })
  setLoginRestriction(@CurrentUser() user: User): Promise<LoginRestriction> {
    this.loginRestriction[user.nationalId] = {
      restricted: true,
      until: this.getRestrictionDate(),
    }

    return Promise.resolve(this.loginRestriction[user.nationalId])
  }

  @Mutation(() => Boolean, { name: 'removeAuthLoginRestriction' })
  removeLoginRestriction(@CurrentUser() user: User): Promise<boolean> {
    delete this.loginRestriction[user.nationalId]

    return Promise.resolve(true)
  }

  private getRestrictionDate(): Date {
    return startOfDay(addDays(new Date(), 7))
  }
}
