import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { HmsLoansClientService } from '@island.is/clients/hms-loans'
import { Audit } from '@island.is/nest/audit'

import { LanayfirlitModel } from './models/hmsLoansLanayfirlit.model'
import { GreidsluyfirlitModel } from './models/hmsLoansGreidsluyfirlit.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeLoans)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-loans' })
export class HmsLoansResolver {
  constructor(private hmsLoansService: HmsLoansClientService) {}

  @Query(() => LanayfirlitModel, { nullable: true })
  @Audit()
  async getHmsLoansLanayfirlit(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansLanayfirlit(
      user.nationalId,
      user,
    )
  }

  @Query(() => GreidsluyfirlitModel, { nullable: true })
  @Audit()
  async getHmsLoansGreidsluyfirlit(@CurrentUser() user: User) {
    return this.hmsLoansService.getHmsLoansGreidsluyfirlit(
      user.nationalId,
      user,
    )
  }
}
