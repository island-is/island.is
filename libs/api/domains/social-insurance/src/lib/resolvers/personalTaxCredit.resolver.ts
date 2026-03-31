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
  RegisterTaxCardAllowanceInput,
  UpdateTaxCardAllowanceInput,
  DiscontinueTaxCardAllowanceInput,
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
    name: 'registerSocialInsuranceTaxCardAllowance',
  })
  @Audit()
  async registerTaxCardAllowance(
    @Args('input') input: RegisterTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.setTaxCardAllowance(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'updateSocialInsuranceTaxCardAllowance',
  })
  @Audit()
  async updateTaxCardAllowance(
    @Args('input') input: UpdateTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.editTaxCardAllowance(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'discontinueSocialInsuranceTaxCardAllowance',
  })
  @Audit()
  async discontinueTaxCardAllowance(
    @Args('input') input: DiscontinueTaxCardAllowanceInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.discontinueTaxCardAllowance(user, input)
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
