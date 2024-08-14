import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  BypassAuth,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from '../socialInsurance.service'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { PensionCalculationInput } from '../dtos/pensionCalculation.input'
import { PensionCalculationResponse } from '../models/pension/pensionCalculation.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PensionResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PensionCalculationResponse)
  @BypassAuth()
  async getPensionCalculation(@Args('input') input: PensionCalculationInput) {
    return this.service.getPensionCalculation(input)
  }
}
