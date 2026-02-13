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
import { SocialInsuranceAdministrationBankInformationService } from '@island.is/clients/social-insurance-administration'
import { SocialInsuranceBankInformation } from '../models/bankInformation/bankInformation.model'
import { BankInformationInput } from '../dtos/bankInformation.input'
import { mapBankInformation } from '../mappers/mapBankInformation'

@Resolver(() => SocialInsuranceBankInformation)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalMyPagesTRBankInformationPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class BankInformationResolver {
  constructor(
    private readonly bankInformationService: SocialInsuranceAdministrationBankInformationService,
  ) {}

  @Query(() => SocialInsuranceBankInformation, {
    name: 'socialInsuranceBankInformation',
    nullable: true,
  })
  async bankInformation(@CurrentUser() user: User) {
    const bankInfo = await this.bankInformationService.getBankInformation(user)

    if (!bankInfo) {
      return null
    }

    return mapBankInformation(bankInfo)
  }

  @Mutation(() => Boolean, {
    name: 'updateSocialInsuranceBankInformation',
  })
  async updateBankInformation(
    @Args('input') input: BankInformationInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.bankInformationService.postBankInformation(user, input)
    return true
  }
}
