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
@Resolver()
export class HealthDirectorateResolver {
  constructor(private api: HealthDirectorateService) {}

  /* Organ Donation */
  @Query(() => DonorStatus)
  getDonorStatus(@CurrentUser() user: User): Promise<DonorStatus> {
    return this.api.getDonorStatus(user)
  }

  @Query(() => DonationException)
  getDonationExceptions(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<DonationException> {
    return this.api.getDonationExceptions(user, locale)
  }

  @Mutation()
  async updateDonorStatus(
    @Args('input') input: DonorStatusInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.api.updateDonorStatus(user, input)
  }

  /* Vaccinations */
  @Query(() => [Vaccinations])
  getVaccinations(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Array<Vaccinations>> {
    return this.api.getVaccinations(user, locale)
  }
}
