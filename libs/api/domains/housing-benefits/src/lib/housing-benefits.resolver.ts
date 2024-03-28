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
import { HousingBenefitPaymentsResponse } from './models/housingBenefit.model'
import { HousingBenefitPaymentsInput } from './dto/getHmsLoansPaymenthistory.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview)
@Resolver()
@Audit({ namespace: '@island.is/api/hms-housing-benefits' })
export class HousingBenefitsResolver {
  constructor(
    private housingBenefitsService: HmsHousingBenefitsClientService,
  ) {}

  @Query(() => HousingBenefitPaymentsResponse, {
    name: 'housingBenefitPayments',
    nullable: true,
  })
  @Audit()
  async getHousingBenefitPayments(
    @CurrentUser() user: User,
    @Args('input') input: HousingBenefitPaymentsInput,
  ): Promise<HousingBenefitPaymentsResponse | null> {
    return await this.housingBenefitsService.hmsPaymentHistory(user, {
      ...input,
      version: '1',
    })
  }
}
