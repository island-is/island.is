import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { DrugService } from './drug.service'
import { DrugPeriod } from './models/drugPeroid.model'
import { DrugBill } from './models/drugBill.model'
import { DrugBillInput } from './dto/drugBill.input'
import { DrugBillLine } from './models/drugBillLine.model'
import { DrugBillLineInput } from './dto/drugBillLine.input'
import { DrugInput } from './dto/drug.input'
import { PaginatedDrugResponse } from './models/drug.model'
import { DrugCalculatorResponse } from './models/drugCalculator.model'
import { DrugCalculatorInput } from './dto/drugCalculator.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/drug' })
export class DrugResolver {
  constructor(private readonly drugService: DrugService) {}

  @Scopes(ApiScope.health)
  @Query(() => [DrugPeriod], {
    name: 'rightsPortalDrugPeriods',
  })
  @Audit()
  getRightsPortalDrugsPaymentPeroids(@CurrentUser() user: User) {
    return this.drugService.getPeriods(user)
  }

  @Scopes(ApiScope.health)
  @Query(() => [DrugBill], {
    name: 'rightsPortalDrugBills',
  })
  @Audit()
  getRightsPortalDrugBills(
    @CurrentUser() user: User,
    @Args('input') input: DrugBillInput,
  ) {
    return this.drugService.getBills(user, input)
  }

  @Scopes(ApiScope.health)
  @Query(() => [DrugBillLine], {
    name: 'rightsPortalDrugBillLines',
  })
  @Audit()
  getRightsPortalDrugBillLineItems(
    @CurrentUser() user: User,
    @Args('input') input: DrugBillLineInput,
  ) {
    return this.drugService.getBillLines(user, input)
  }

  @Scopes(ApiScope.health)
  @Query(() => PaginatedDrugResponse, {
    name: 'rightsPortalDrugs',
  })
  @Audit()
  getRightsPortalDrugs(
    @CurrentUser() user: User,
    @Args('input') input: DrugInput,
  ) {
    return this.drugService.getDrugs(user, input)
  }

  @Scopes(ApiScope.health)
  @Mutation(() => DrugCalculatorResponse, {
    name: 'rightsPortalDrugsCalculator',
  })
  @Audit()
  getRightsPortalDrugsCalculator(
    @CurrentUser() user: User,
    @Args('input') input: DrugCalculatorInput,
  ) {
    return this.drugService.getCalculations(user, input)
  }
}
