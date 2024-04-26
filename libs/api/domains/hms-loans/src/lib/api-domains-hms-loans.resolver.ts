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

import { LoanHistory } from './models/loanHistory.model'
import { PaymentHistory } from './models/paymenthistory.model'
import { GetHmsLoansPaymentHistoryInput } from './dto/getHmsLoansPaymenthistory.input'
import { LoanHistoryPdf } from './models/loanHistoryPdf.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeLoans)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-loans' })
export class HmsLoansResolver {
  constructor(private hmsLoansService: HmsLoansClientService) {}

  @Query(() => [LoanHistory], { name: 'hmsLoansHistory', nullable: true })
  @Audit()
  async getHmsLoansHistory(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansHistory(user)
  }

  @Query(() => LoanHistoryPdf, {
    name: 'hmsLoansHistoryPdf',
    nullable: true,
  })
  @Audit()
  async getHmsLoansHistoryPdf(@CurrentUser() user: User) {
    return await this.hmsLoansService.getHmsLoansHistoryPdf(user)
  }

  @Query(() => [PaymentHistory], {
    name: 'hmsLoansPaymentHistory',
    nullable: true,
  })
  @Audit()
  async getHmsLoansPaymentHistory(
    @CurrentUser() user: User,
    @Args('input') input: GetHmsLoansPaymentHistoryInput,
  ) {
    return this.hmsLoansService.getHmsLoansPaymentHistory(user, input.loanId)
  }
}
