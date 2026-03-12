import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CertificateForSicknessAndRehabilitation } from '../models/medicalDocuments/certificateForSicknessAndRehabilitation.model'
import { ConfirmationOfIllHealth } from '../models/medicalDocuments/confirmationOfIllHealth.model'
import { ConfirmationOfPendingResolution } from '../models/medicalDocuments/confirmationOfPendingResolution.model'
import { ConfirmedTreatment } from '../models/medicalDocuments/confirmedTreatment.model'
import { RehabilitationPlan } from '../models/medicalDocuments/rehabilitationPlan.model'
import { SocialInsuranceService } from '../socialInsurance.service'
import type { Locale } from '@island.is/shared/types'
import { DisabilityPensionCertificate } from '../models/medicalDocuments/disabilityPensionCertificate.model'
import { SocialInsuranceAdministrationMedicalDocumentsService } from '@island.is/clients/social-insurance-administration'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class MedicalDocumentsResolver {
  constructor(
    private readonly service: SocialInsuranceService,
    private readonly medicalDocumentsService: SocialInsuranceAdministrationMedicalDocumentsService,
  ) {}

  @Query(() => RehabilitationPlan, {
    name: 'socialInsuranceRehabilitationPlan',
  })
  async siaGetRehabilitationPlan(@CurrentUser() user: User) {
    return this.medicalDocumentsService.getRehabilitationPlan(user)
  }

  @Query(() => CertificateForSicknessAndRehabilitation, {
    name: 'socialInsuranceCertificateForSicknessAndRehabilitation',
  })
  async siaGetCertificateForSicknessAndRehabilitation(
    @CurrentUser() user: User,
  ) {
    return this.medicalDocumentsService.getCertificateForSicknessAndRehabilitation(
      user,
    )
  }

  @Query(() => DisabilityPensionCertificate, {
    name: 'socialInsuranceDisabilityPensionCertificate',
  })
  async siaGetDisabilityPensionCertificate(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.service.getDisabilityPensionCertificate(user, locale)
  }

  @Query(() => ConfirmedTreatment, {
    name: 'socialInsuranceConfirmedTreatment',
  })
  async siaGetConfirmedTreatment(@CurrentUser() user: User) {
    return this.medicalDocumentsService.getConfirmedTreatment(user)
  }

  @Query(() => ConfirmationOfPendingResolution, {
    name: 'socialInsuranceConfirmationOfPendingResolution',
  })
  async siaGetConfirmationOfPendingResolution(@CurrentUser() user: User) {
    return this.medicalDocumentsService.getConfirmationOfPendingResolution(user)
  }

  @Query(() => ConfirmationOfIllHealth, {
    name: 'socialInsuranceConfirmationOfIllHealth',
  })
  async siaGetConfirmationOfIllHealth(@CurrentUser() user: User) {
    return this.medicalDocumentsService.getConfirmationOfIllHealth(user)
  }
}
