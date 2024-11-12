import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

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
import { DonorInput, Organ, OrganDonation } from './models/organ-donation.model'
import type { Locale } from '@island.is/shared/types'
import { Vaccinations } from './models/vaccinations.model'
import { HealthDirectorateService } from './health-directorate.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => OrganDonation)
export class HealthDirectorateResolver {
  constructor(private api: HealthDirectorateService) {}

  /* Organ Donation */
  @Query(() => OrganDonation, {
    name: 'healthDirectorateOrganDonation',
  })
  @Audit()
  async getDonorStatus(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<OrganDonation> {
    const data = await this.api.getDonorStatus(user, locale)
    return { donor: data, locale: locale }
  }
  @ResolveField('organList', () => [Organ], {
    nullable: true,
  })
  async resolveOrganList(
    @Parent() organDonation: OrganDonation,
    @CurrentUser() user: User,
  ): Promise<Array<Organ>> {
    return this.api.getDonationExceptions(user, organDonation.locale ?? 'is')
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'healthDirectorateOrganDonationUpdateDonorStatus',
  })
  @Audit()
  async updateDonorStatus(
    @Args('input') input: DonorInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.api.updateDonorStatus(user, input, locale)
  }

  /* Vaccinations */
  @Query(() => Vaccinations, {
    name: 'healthDirectorateVaccinations',
  })
  @Audit()
  getVaccinations(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Vaccinations | null> {
    return this.api.getVaccinations(user, locale)
  }
}
