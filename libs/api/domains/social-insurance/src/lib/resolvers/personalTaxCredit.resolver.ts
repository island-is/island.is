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
import { PersonalTaxCredit } from '../models/personalTaxCredit/taxCard.model'
import {
  TaxCardAllowanceAction,
  UpdateTaxCardAllowanceInput,
  SetSpouseTaxCardDueToDeathInput,
} from '../dtos/personalTaxCredit.input'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalMyPagesTRPersonalTaxCreditPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PersonalTaxCreditResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PersonalTaxCredit, {
    name: 'socialInsurancePersonalTaxCredit',
    nullable: true,
  })
  @Audit()
  getPersonalTaxCredit(
    @CurrentUser() user: User,
  ): Promise<PersonalTaxCredit | null> {
    return this.service.getPersonalTaxCredit(user)
  }

  @Mutation(() => Boolean, {
    name: 'updateSocialInsuranceTaxCardAllowance',
  })
  @Audit()
  async updateTaxCardAllowance(
    @Args('input') input: UpdateTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const { action, year, month, percentage } = input
    if (action === TaxCardAllowanceAction.REGISTER) {
      await this.service.setTaxCardAllowance(user, { year, month, percentage })
    } else if (action === TaxCardAllowanceAction.EDIT) {
      await this.service.editTaxCardAllowance(user, { percentage })
    } else if (action === TaxCardAllowanceAction.DISCONTINUE) {
      await this.service.discontinueTaxCardAllowance(user, { year, month })
    } else {
      throw new Error(`Unknown tax card allowance action: ${action}`)
    }
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCard',
  })
  @Audit()
  async setSpouseTaxCard(@CurrentUser() user: User): Promise<boolean> {
    await this.service.setSpouseTaxCard(user)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCardDueToDeath',
  })
  @Audit()
  async setSpouseTaxCardDueToDeath(
    @Args('input') input: SetSpouseTaxCardDueToDeathInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.setSpouseTaxCardDueToDeath(user, input)
    return true
  }
}
