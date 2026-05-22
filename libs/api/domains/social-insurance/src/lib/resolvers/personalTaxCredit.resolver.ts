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
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { PersonalTaxCredit } from '../models/personalTaxCredit/taxCard.model'
import { PersonalTaxCreditSpouseInfo } from '../models/personalTaxCredit/spouseInfo.model'
import { TaxBracketAction } from '../enums/taxBracketAction'
import { RegisterTaxCardAllowanceInput } from '../dtos/registerTaxCardAllowance.input'
import { UpdateTaxCardAllowanceInput } from '../dtos/updateTaxCardAllowance.input'
import { DiscontinueTaxCardAllowanceInput } from '../dtos/discontinueTaxCardAllowance.input'
import { SetSpouseTaxCardInput } from '../dtos/setSpouseTaxCard.input'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver(() => PersonalTaxCredit)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalTRPersonalTaxCreditPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
@CodeOwner(CodeOwners.Hugsmidjan)
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

  @Query(() => TaxBracketAction, {
    name: 'socialInsurancePersonalTaxCreditTaxBracket',
    nullable: true,
  })
  @Audit()
  getTaxBracket(@CurrentUser() user: User): Promise<TaxBracketAction | null> {
    return this.service.getTaxBracket(user)
  }

  @Query(() => PersonalTaxCreditSpouseInfo, {
    name: 'socialInsurancePersonalTaxCreditSpouseInfo',
    nullable: true,
  })
  @Audit()
  getSpouseInfo(
    @CurrentUser() user: User,
  ): Promise<PersonalTaxCreditSpouseInfo | null> {
    return this.service.getSpouseInfo(user)
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
    name: 'setSocialInsurancePersonalTaxCreditTaxBracket',
  })
  @Audit()
  async setTaxBracket(
    @Args('taxBracket', { type: () => TaxBracketAction })
    taxBracket: TaxBracketAction,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.setTaxBracket(user, taxBracket)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCard',
  })
  @Audit()
  async setSpouseTaxCard(
    @Args('input') input: SetSpouseTaxCardInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.setSpouseTaxCard(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'setSocialInsuranceSpouseTaxCardDueToDeath',
  })
  @Audit()
  async setSpouseTaxCardDueToDeath(
    @Args('input') input: SetSpouseTaxCardInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.service.setSpouseTaxCardDueToDeath(user, input)
    return true
  }
}
