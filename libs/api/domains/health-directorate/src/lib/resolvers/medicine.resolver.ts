import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ForbiddenException, UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  StepUpTokenRejectedError,
  type StepUpClaims,
} from '@island.is/auth/step-up'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import {
  MedicineDelegationCheckStepUpInput,
  MedicineDelegationCreateOrDeleteInput,
  MedicineDelegationInput,
} from '.././dto/medicineDelegation.input'
import { HealthDirectorateResponse } from '.././dto/response.dto'
import { HealthDirectorateService } from '.././health-directorate.service'
import {
  hashGrant,
  MedicineDelegationStepUpService,
  type MedicineDelegationStepUpOutcome,
} from '.././medicine-delegation-step-up.service'
import {
  MedicineDelegationCreateResponse,
  MedicineDelegationStepUpMethod,
  MedicineDelegationStepUpResult,
  MedicineDelegationStepUpStatus,
} from '.././models/medicineDelegationStepUp.model'
import { MedicineDelegations } from '.././models/medicineDelegation.model'
import { MedicineHistory } from '.././models/medicineHistory.model'
import { MedicineDispensationsATCInput } from '.././models/medicineHistoryATC.dto'
import { MedicineDispensationsATC } from '.././models/medicineHistoryATC.model'
import { MedicinePrescriptionDocumentsInput } from '.././models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from '.././models/prescriptionDocuments.model'
import { Prescriptions } from '.././models/prescriptions.model'
import { HealthDirectorateRenewalInput } from '.././models/renewal.input'
import { PrescriptionRenewalTarget } from '.././models/renewalTarget.model'

const namespace = '@island.is/api/health-directorate'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace })
@Resolver()
export class MedicineResolver {
  constructor(
    private api: HealthDirectorateService,
    private stepUp: MedicineDelegationStepUpService,
    private auditService: AuditService,
  ) {}

  /* Prescriptions */
  @Query(() => Prescriptions, {
    name: 'healthDirectoratePrescriptions',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.healthPrescription)
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
  @Scopes(ApiScope.internal, ApiScope.healthPrescription)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getPrescriptionDocuments(
    @Args('input') input: MedicinePrescriptionDocumentsInput,
    @CurrentUser() user: User,
  ): Promise<PrescriptionDocuments | null> {
    return this.api.getPrescriptionDocuments(user, input)
  }

  /* Prescription Renewal Targets */
  @Query(() => [PrescriptionRenewalTarget], {
    nullable: true,
    name: 'healthDirectoratePrescriptionRenewalTargets',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.healthPrescription)
  @FeatureFlag(Features.servicePortalHealthMedicineLandlaeknirPageEnabled)
  getPrescriptionRenewalTargets(
    @Args('prescriptionId', { type: () => String }) prescriptionId: string,
    @CurrentUser() user: User,
  ): Promise<PrescriptionRenewalTarget[] | null> {
    return this.api.getPrescriptionRenewalTargets(user, prescriptionId)
  }

  /* Prescription Renewal */
  @Mutation(() => Prescriptions, {
    nullable: true,
    name: 'healthDirectoratePrescriptionRenewal',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.healthPrescription)
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
  @Scopes(ApiScope.internal, ApiScope.healthDispensations)
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
  @Scopes(ApiScope.internal, ApiScope.healthDispensations)
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

  /* Add new Prescription Delegation. Audited by hand: who it is for, and whether electronic ID confirmed it. */
  @Mutation(() => MedicineDelegationCreateResponse, {
    name: 'healthDirectorateMedicineDelegationCreate',
  })
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineDelegationPageEnabled)
  async postMedicineDelegation(
    @Args('input') input: MedicineDelegationCreateOrDeleteInput,
    @CurrentUser() user: User,
  ): Promise<MedicineDelegationCreateResponse> {
    if (await this.stepUp.isRequired(user)) {
      // Nothing is saved until the person has authenticated for this grant.
      const stepUp = await this.stepUp.start(user, input)
      this.auditService.audit({
        auth: user,
        namespace,
        action: 'startMedicineDelegationStepUp',
        resources: input.nationalId,
        meta: { method: stepUp.method, grant: hashGrant(user, input) },
      })
      return {
        success: false,
        stepUp: {
          ...stepUp,
          method: MedicineDelegationStepUpMethod[stepUp.method],
        },
      }
    }

    const result = await this.api.postMedicineDelegation(user, input)
    this.auditGrant(user, input, result.success)
    return result
  }

  /* Finish a Prescription Delegation that waits for electronic ID. A mutation: it saves, and must not be cached. */
  @Mutation(() => MedicineDelegationStepUpResult, {
    name: 'healthDirectorateMedicineDelegationCheckStepUp',
  })
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthMedicineDelegationPageEnabled)
  async checkMedicineDelegationStepUp(
    @Args('input') input: MedicineDelegationCheckStepUpInput,
    @CurrentUser() user: User,
  ): Promise<MedicineDelegationStepUpResult> {
    let outcome: MedicineDelegationStepUpOutcome
    try {
      outcome = await this.stepUp.check(user, input.authReqId, input.delegation)
    } catch (error) {
      // An authentication that was made, but not by this person or not for this grant.
      if (
        error instanceof ForbiddenException ||
        error instanceof StepUpTokenRejectedError
      ) {
        this.auditService.audit({
          auth: user,
          namespace,
          action: 'refuseMedicineDelegationStepUp',
          resources: input.delegation.nationalId,
          meta: {
            reason: error.message,
            grant: hashGrant(user, input.delegation),
          },
        })
      }
      throw error
    }

    if (outcome.status !== 'confirmed') {
      return {
        status: MedicineDelegationStepUpStatus[outcome.status],
        success: false,
      }
    }

    const { success } = await this.api.postMedicineDelegation(
      user,
      input.delegation,
    )
    this.auditGrant(user, input.delegation, success, outcome.claims)
    return { status: MedicineDelegationStepUpStatus.confirmed, success }
  }

  private auditGrant(
    user: User,
    input: MedicineDelegationCreateOrDeleteInput,
    success: boolean,
    stepUp?: StepUpClaims,
  ) {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'postMedicineDelegation',
      resources: input.nationalId,
      meta: {
        success,
        from: input.from?.toISOString(),
        to: input.to?.toISOString(),
        lookup: input.lookup === true,
        stepUp: stepUp != null,
        grant: hashGrant(user, input),
        ...(stepUp && {
          stepUpAcr: stepUp.acr,
          stepUpAuthTime: stepUp.authTime.toISOString(),
        }),
      },
    })
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
