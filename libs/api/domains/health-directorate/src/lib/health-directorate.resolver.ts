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
import {
  MedicineDelegationCreateOrDeleteInput,
  MedicineDelegationInput,
} from './dto/medicineDelegation.input'
import {
  InvalidatePermitInput,
  PermitInput,
  PermitsInput,
} from './dto/permit.input'
import { HealthDirectorateReferralInput } from './dto/referral.input'
import { HealthDirectorateResponse } from './dto/response.dto'
import { HealthDirectorateWaitlistInput } from './dto/waitlist.input'
import { HealthDirectorateService } from './health-directorate.service'
import { MedicineDelegations } from './models/medicineDelegation.model'
import { MedicineHistory } from './models/medicineHistory.model'
import { MedicineDispensationsATCInput } from './models/medicineHistoryATC.dto'
import { MedicineDispensationsATC } from './models/medicineHistoryATC.model'
import { DonorInput, Organ, OrganDonation } from './models/organ-donation.model'
import { Countries } from './models/permits/country.model'
import { Permit, PermitReturn, Permits } from './models/permits/permits'
import { MedicinePrescriptionDocumentsInput } from './models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from './models/prescriptionDocuments.model'
import { Prescriptions } from './models/prescriptions.model'
import { ReferralDetail } from './models/referral.model'
import { Referrals } from './models/referrals.model'
import { HealthDirectorateRenewalInput } from './models/renewal.input'
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

  /* Prescription Documents */
  @Query(() => PrescriptionDocuments, {
    name: 'healthDirectoratePrescriptionDocuments',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getPrescriptionDocuments(
    @Args('input') input: MedicinePrescriptionDocumentsInput,
    @CurrentUser() user: User,
  ): Promise<PrescriptionDocuments | null> {
    return this.api.getPrescriptionDocuments(user, input)
  }

  /* Prescription Renewal */
  @Mutation(() => Prescriptions, {
    nullable: true,
    name: 'healthDirectoratePrescriptionRenewal',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  postPrescriptionRenewal(
    @Args('input') input: HealthDirectorateRenewalInput,
    @CurrentUser() user: User,
  ): Promise<Prescriptions | null> {
    return this.api.postRenewal(user, input)
  }

  /* Medicine History */
  @Query(() => MedicineHistory, {
    name: 'healthDirectorateMedicineHistory',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getMedicineHistory(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<MedicineHistory | null> {
    return this.api.getMedicineHistory(user, locale)
  }

  /* Medicine dispensations for specific ATC code */
  @Query(() => MedicineDispensationsATC, {
    name: 'healthDirectorateMedicineDispensationsATC',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getMedicineHistoryForATC(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: MedicineDispensationsATCInput,
    @CurrentUser() user: User,
  ): Promise<MedicineDispensationsATC | null> {
    return this.api.getMedicineDispensationsForATC(user, locale, input)
  }

  /* Prescription Delegations */
  @Query(() => MedicineDelegations, {
    nullable: true,
    name: 'healthDirectorateMedicineDelegations',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineDelegationPageEnabled)
  getMedicineDelegations(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: MedicineDelegationInput,
    @CurrentUser() user: User,
  ): Promise<MedicineDelegations | null> {
    return this.api.getMedicineDelegations(user, locale, input)
  }

  /* Add new Prescription Delegation */
  @Mutation(() => HealthDirectorateResponse, {
    name: 'healthDirectorateMedicineDelegationCreate',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineDelegationPageEnabled)
  postMedicineDelegation(
    @Args('input') input: MedicineDelegationCreateOrDeleteInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateResponse> {
    return this.api.postMedicineDelegation(user, input)
  }

  /* Delete prescription Delegation */
  @Mutation(() => HealthDirectorateResponse, {
    name: 'healthDirectorateMedicineDelegationDelete',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineDelegationPageEnabled)
  deleteMedicineDelegation(
    @Args('input') input: MedicineDelegationCreateOrDeleteInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateResponse> {
    return this.api.deleteMedicineDelegation(user, input)
  }
  /* Patient data - Permits */

  @Query(() => Permits, {
    name: 'healthDirectoratePatientDataPermits',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermits(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { type: () => PermitsInput })
    input: PermitsInput,
    @CurrentUser() user: User,
  ): Promise<Permits | null> {
    return this.api.getPermits(user, locale, input)
  }

  @Query(() => Permit, {
    name: 'healthDirectoratePatientDataPermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermit(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Permit | null> {
    return this.api.getPermit(user, locale, id)
  }

  @Query(() => Countries, {
    name: 'healthDirectoratePatientDataPermitCountries',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermitCountries(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Countries | null> {
    return this.api.getPermitCountries(user, locale)
  }

  @Mutation(() => PermitReturn, {
    nullable: true,
    name: 'healthDirectoratePatientDataCreatePermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  async createPermit(
    @Args('input') input: PermitInput,
    @CurrentUser() user: User,
  ): Promise<PermitReturn | null> {
    return this.api.createPermit(user, input)
  }

  @Mutation(() => PermitReturn, {
    nullable: true,
    name: 'healthDirectoratePatientDataInvalidatePermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  async invalidatePermit(
    @Args('input') input: InvalidatePermitInput,
    @CurrentUser() user: User,
  ): Promise<PermitReturn | null> {
    return this.api.invalidatePermit(user, input)
  }
}
