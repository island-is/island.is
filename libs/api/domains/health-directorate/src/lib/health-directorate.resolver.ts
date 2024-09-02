import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  DonationException,
  DonorStatus,
  DonorStatusInput,
} from './models/organ-donation.model'
import type { Locale } from '@island.is/shared/types'
import { Vaccinations } from './models/vaccinations.model'
import { HealthDirectorateService } from './health-directorate.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver()
export class HealthDirectorateResolver {
  constructor(private api: HealthDirectorateService) {}

  /* Organ Donation */
  @Query(() => DonorStatus, {
    name: 'HealthDirectorateOrganDonationGetDonorStatus',
  })
  @Audit()
  getDonorStatus(@CurrentUser() user: User): Promise<DonorStatus> {
    return this.api.getDonorStatus(user)
  }

  @Query(() => DonationException, {
    name: 'HealthDirectorateOrganDonationGetDonationExceptions',
  })
  @Audit()
  getDonationExceptions(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<DonationException> {
    return this.api.getDonationExceptions(user, locale)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'HealthDirectorateOrganDonationUpdateDonorStatus',
  })
  @Audit()
  async updateDonorStatus(
    @Args('input') input: DonorStatusInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.api.updateDonorStatus(user, input)
  }

  /* Vaccinations */
  @Query(() => [Vaccinations], {
    name: 'HealthDirectorateVaccinationsGetVaccinations',
  })
  @Audit()
  getVaccinations(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Array<Vaccinations>> {
    return this.api.getVaccinations(user, locale)
  }
}
