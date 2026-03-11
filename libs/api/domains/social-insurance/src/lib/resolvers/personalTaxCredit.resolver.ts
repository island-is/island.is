import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { SocialInsuranceAdministrationPersonalTaxCreditService } from '@island.is/clients/social-insurance-administration'
import { TaxCards } from '../models/personalTaxCredit/taxCard.model'
import { TaxCardMonthsAndYears } from '../models/personalTaxCredit/taxCardMonthsAndYears.model'
import { SpousalTaxCardEligibility } from '../models/personalTaxCredit/spousalTaxCardEligibility.model'
import {
  SetTaxCardAllowanceInput,
  EditTaxCardAllowanceInput,
  DiscontinueTaxCardAllowanceInput,
  SetSpouseTaxCardInput,
  SetSpouseTaxCardDueToDeathInput,
} from '../dtos/personalTaxCredit.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalMyPagesTRPersonalTaxCreditPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PersonalTaxCreditResolver {
  constructor(
    private readonly personalTaxCreditService: SocialInsuranceAdministrationPersonalTaxCreditService,
  ) {}

  @Query(() => Int, {
    name: 'socialInsuranceTaxAllowanceActions',
    nullable: true,
  })
  async getTaxAllowanceActions(@CurrentUser() user: User) {
    return this.personalTaxCreditService.getTaxAllowanceActions(user)
  }

  @Query(() => TaxCards, {
    name: 'socialInsuranceTaxCards',
    nullable: true,
  })
  async getTaxCards(@CurrentUser() user: User) {
    return this.personalTaxCreditService.getTaxCards(user)
  }

  @Query(() => TaxCardMonthsAndYears, {
    name: 'socialInsuranceTaxCardMonthsAndYears',
    nullable: true,
  })
  async getTaxCardMonthsAndYears(@CurrentUser() user: User) {
    return this.personalTaxCreditService.getTaxCardMonthsAndYears(user)
  }

  @Query(() => SpousalTaxCardEligibility, {
    name: 'socialInsuranceSpouseDeceasedTaxAllowanceEligibility',
    nullable: true,
  })
  async getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
    @CurrentUser() user: User,
  ) {
    return this.personalTaxCreditService.getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
      user,
    )
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceTaxCardAllowance',
  })
  async setTaxCardAllowance(
    @Args('input') input: SetTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.personalTaxCreditService.setTaxCardAllowance(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'editSocialInsuranceTaxCardAllowance',
  })
  async editTaxCardAllowance(
    @Args('input') input: EditTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.personalTaxCreditService.editTaxCardAllowance(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'discontinueSocialInsuranceTaxCardAllowance',
  })
  async discontinueTaxCardAllowance(
    @Args('input') input: DiscontinueTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.personalTaxCreditService.discontinueTaxCardAllowance(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCard',
  })
  async setSpouseTaxCard(
    @Args('input') input: SetSpouseTaxCardInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.personalTaxCreditService.setSpouseTaxCard(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCardDueToDeath',
  })
  async setSpouseTaxCardDueToDeath(
    @Args('input') input: SetSpouseTaxCardDueToDeathInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.personalTaxCreditService.setSpouseTaxCardDueToDeath(user, input)
    return true
  }
}
