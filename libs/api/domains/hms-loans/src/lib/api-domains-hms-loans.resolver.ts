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

import { LoanOverview } from './models/loanOverview.model'
import { PaymentOverview } from './models/paymentOverview.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeLoans)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-loans' })
export class HmsLoansResolver {
  constructor(private hmsLoansService: HmsLoansClientService) {}

  @Query(() => LoanOverview, { nullable: true })
  @Audit()
  async getHmsLoansLoanOverview(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansLoanOverview(user)
  }

  @Query(() => PaymentOverview, { nullable: true })
  @Audit()
  async getHmsLoansPaymentOverview(@CurrentUser() user: User) {
    return this.hmsLoansService.getHmsLoansPaymentOverview(user)
  }
}
