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
import { HmsHousingBenefitsClientService } from '@island.is/clients/hms-housing-benefits'
import { Audit } from '@island.is/nest/audit'
import { HousingBenefitsPaymentsResponse } from './models/housingBenefit.model'
import { HousingBenefitsPaymentsInput } from './dto/getHmsLoansPaymenthistory.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-housing-benefits' })
export class HousingBenefitsResolver {
  constructor(
    private housingBenefitsService: HmsHousingBenefitsClientService,
  ) {}

  @Query(() => HousingBenefitsPaymentsResponse, {
    name: 'housingBenefitsPayments',
    nullable: true,
  })
  @Audit()
  async getHousingBenefitsPayments(
    @CurrentUser() user: User,
    @Args('input') input: HousingBenefitsPaymentsInput,
  ): Promise<HousingBenefitsPaymentsResponse | null> {
    return this.housingBenefitsService.hmsPaymentHistory(user, {
      ...input,
      version: '1',
    })
  }
}
