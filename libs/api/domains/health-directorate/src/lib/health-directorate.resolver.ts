import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { HealthDirectorateReferralInput } from './dto/referral.input'
import { HealthDirectorateWaitlistInput } from './dto/waitlist.input'
import { HealthDirectorateService } from './health-directorate.service'
import { DonorInput, Organ, OrganDonation } from './models/organ-donation.model'
import { Prescriptions } from './models/prescriptions.model'
import { ReferralDetail } from './models/referral.model'
import { Referrals } from './models/referrals.model'
import { Vaccinations } from './models/vaccinations.model'
import { WaitlistDetail } from './models/waitlist.model'
import { Waitlists } from './models/waitlists.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => OrganDonation)
export class HealthDirectorateResolver {
  constructor(private api: HealthDirectorateService) {}

  /* Organ Donation */
  @Query(() => OrganDonation, {
    name: 'healthDirectorateOrganDonation',
  })
  @Audit()
  @Scopes(ApiScope.healthOrganDonation, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthOrganDonationPageEnabled)
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
  @Scopes(ApiScope.healthOrganDonation, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthOrganDonationPageEnabled)
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
  @Scopes(ApiScope.healthVaccinations, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthVaccinationsPageEnabled)
  getVaccinations(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Vaccinations | null> {
    return this.api.getVaccinations(user, locale)
  }

  /* Waitlists */
  @Query(() => Waitlists, {
    name: 'healthDirectorateWaitlists',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthWaitlistsPageEnabled)
  getWaitlists(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Waitlists | null> {
    return this.api.getWaitlists(user, locale)
  }

  /* Waitlist */
  @Query(() => WaitlistDetail, {
    name: 'healthDirectorateWaitlist',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthWaitlistsPageEnabled)
  getWaitlist(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: HealthDirectorateWaitlistInput,
    @CurrentUser() user: User,
  ): Promise<WaitlistDetail | null> {
    return this.api.getWaitlist(user, locale, input.id)
  }

  /* Referrals */
  @Query(() => Referrals, {
    name: 'healthDirectorateReferrals',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthReferralsPageEnabled)
  getReferrals(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Referrals | null> {
    return this.api.getReferrals(user, locale)
  }

  /* Referral */
  @Query(() => ReferralDetail, {
    name: 'healthDirectorateReferral',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthReferralsPageEnabled)
  getReferral(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: HealthDirectorateReferralInput,
    @CurrentUser() user: User,
  ): Promise<ReferralDetail | null> {
    return this.api.getReferral(user, locale, input.id)
  }

  /* Prescriptions */
  @Query(() => Prescriptions, {
    name: 'healthDirectoratePrescriptions',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getPrescriptions(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Prescriptions | null> {
    return this.api.getPrescriptions(user, locale)
  }
}
