import { Query, Resolver, Args } from '@nestjs/graphql'
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
import { GetHmsLoansPaymenthistoryInput } from './dto/getHmsLoansPaymenthistory.input'
import { LoanhistoryPdf } from './models/loanHistoryPdf.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeLoans)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-loans' })
export class HmsLoansResolver {
  constructor(private hmsLoansService: HmsLoansClientService) {}

  @Query(() => [Loanhistory], { name: 'hmsLoansLoanhistory', nullable: true })
  @Audit()
  async getHmsLoansLoanhistory(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansLoanhistory(user)
  }

  @Query(() => LoanhistoryPdf, {
    name: 'hmsLoansLoanhistoryPdf',
    nullable: true,
  })
  @Audit()
  async getHmsLoansLoanhistoryPdf(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansLoanhistoryPdf(user)
  }

  @Query(() => [Paymenthistory], {
    name: 'hmsLoansPaymenthistory',
    nullable: true,
  })
  @Audit()
  async getHmsLoansPaymenthistory(
    @CurrentUser() user: User,
    @Args('input') input: GetHmsLoansPaymenthistoryInput,
  ) {
    return this.hmsLoansService.getHmsLoansPaymenthistory(user, input.loanId)
  }
}
