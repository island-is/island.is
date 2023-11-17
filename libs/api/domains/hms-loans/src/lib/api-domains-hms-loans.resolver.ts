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

import { Loanhistory } from './models/loanHistory.model'
import { Paymenthistory } from './models/paymenthistory.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeLoans)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-loans' })
export class HmsLoansResolver {
  constructor(private hmsLoansService: HmsLoansClientService) {}

  @Query(() => [Loanhistory], { name: 'hmsLoans', nullable: true })
  @Audit()
  async getHmsLoans(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansLoanhistory(user)
  }

  @Query(() => [Paymenthistory], { name: 'hmsLoansPayments', nullable: true })
  @Audit()
  async getHmsLoansPayments(@CurrentUser() user: User) {
    return this.hmsLoansService.getHmsLoansPaymenthistory(user)
  }
}
