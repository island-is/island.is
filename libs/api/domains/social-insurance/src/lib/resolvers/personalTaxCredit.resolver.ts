import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
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
import { PersonalTaxCredit } from '../models/personalTaxCredit/taxCard.model'
import { YearWithMonths } from '../models/personalTaxCredit/taxCardMonthsAndYears.model'
import {
  TaxCardAllowanceAction,
  UpdateTaxCardAllowanceInput,
  SetSpouseTaxCardDueToDeathInput,
} from '../dtos/personalTaxCredit.input'

const toYearWithMonths = (
  raw:
    | Array<{
        year?: number
        months?: Array<{ month?: number; selectable?: boolean }> | null
      }>
    | null
    | undefined,
): YearWithMonths[] | null =>
  raw?.map((ym) => ({
    year: ym.year,
    months: (ym.months ?? [])
      .filter(
        (m): m is { month: number; selectable?: boolean } =>
          m.selectable === true && m.month != null,
      )
      .map((m) => m.month),
  })) ?? null

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalMyPagesTRPersonalTaxCreditPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PersonalTaxCreditResolver {
  constructor(
    private readonly personalTaxCreditService: SocialInsuranceAdministrationPersonalTaxCreditService,
  ) {}

  @Query(() => PersonalTaxCredit, {
    name: 'socialInsurancePersonalTaxCredit',
    nullable: true,
  })
  async getPersonalTaxCredit(
    @CurrentUser() user: User,
  ): Promise<PersonalTaxCredit> {
    const [taxCardsResult, registrationMonthsAndYears, spouseEligibility] =
      await Promise.all([
        this.personalTaxCreditService.getTaxCards(user),
        this.personalTaxCreditService.getTaxCardMonthsAndYears(user),
        this.personalTaxCreditService.getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
          user,
        ),
      ])

    const discontinuingMonthsAndYears =
      taxCardsResult?.canDiscontinuePersonalAllowance
        ? await this.personalTaxCreditService.getTaxCardMonthsAndYearsWhenDiscontinuing(
            user,
          )
        : null

    return {
      taxCards: taxCardsResult?.taxCards,
      canEdit: taxCardsResult?.canEditPersonalAllowance,
      canDiscontinue: taxCardsResult?.canDiscontinuePersonalAllowance,
      registrationMonthsAndYears: toYearWithMonths(registrationMonthsAndYears),
      discontinuingMonthsAndYears: toYearWithMonths(
        discontinuingMonthsAndYears,
      ),
      spouseEligibility: spouseEligibility
        ? {
            ...spouseEligibility,
            allowedYearMonths: toYearWithMonths(
              spouseEligibility.allowedYearMonths,
            ),
          }
        : null,
    }
  }

  @Mutation(() => Boolean, {
    name: 'updateSocialInsuranceTaxCardAllowance',
  })
  async updateTaxCardAllowance(
    @Args('input') input: UpdateTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const { action, year, month, percentage } = input
    if (action === TaxCardAllowanceAction.REGISTER) {
      await this.personalTaxCreditService.setTaxCardAllowance(user, {
        year,
        month,
        percentage,
      })
    } else if (action === TaxCardAllowanceAction.EDIT) {
      await this.personalTaxCreditService.editTaxCardAllowance(user, {
        percentage,
      })
    } else if (action === TaxCardAllowanceAction.DISCONTINUE) {
      await this.personalTaxCreditService.discontinueTaxCardAllowance(user, {
        year,
        month,
      })
    }
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCard',
  })
  async setSpouseTaxCard(@CurrentUser() user: User): Promise<boolean> {
    await this.personalTaxCreditService.setSpouseTaxCard(user, {})
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
