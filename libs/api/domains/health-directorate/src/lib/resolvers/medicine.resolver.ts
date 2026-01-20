import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

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
} from '.././dto/medicineDelegation.input'
import { HealthDirectorateResponse } from '.././dto/response.dto'
import { HealthDirectorateService } from '.././health-directorate.service'
import { MedicineDelegations } from '.././models/medicineDelegation.model'
import { MedicineHistory } from '.././models/medicineHistory.model'
import { MedicineDispensationsATCInput } from '.././models/medicineHistoryATC.dto'
import { MedicineDispensationsATC } from '.././models/medicineHistoryATC.model'
import { MedicinePrescriptionDocumentsInput } from '.././models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from '.././models/prescriptionDocuments.model'
import { Prescriptions } from '.././models/prescriptions.model'
import { HealthDirectorateRenewalInput } from '.././models/renewal.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver()
export class MedicineResolver {
  constructor(private api: HealthDirectorateService) {}

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
}
