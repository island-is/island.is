import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  MedicalDocumentsApi,
  TrWebContractsExternalServicePortalRehabilitationPlan,
  TrWebContractsExternalServicePortalBaseCertificate,
  TrWebContractsExternalServicePortalConfirmedTreatment,
  TrWebContractsExternalServicePortalConfirmationOfPendingResolution,
  TrWebContractsExternalServicePortalConfirmationOfIllHealth,
} from '../../../gen/fetch/v1'

@Injectable()
export class SocialInsuranceAdministrationMedicalDocumentsService {
  constructor(private readonly medicalDocumentsApi: MedicalDocumentsApi) {}

  private medicalDocumentsApiWithAuth = (user: User) =>
    this.medicalDocumentsApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getRehabilitationPlan(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalRehabilitationPlan> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsRehabilitationplanGet()
  }

  async getCertificateForSicknessAndRehabilitation(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalBaseCertificate> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsBasecertificateGet()
  }

  async getConfirmedTreatment(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalConfirmedTreatment> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmedtreatmentGet()
  }

  async getConfirmationOfPendingResolution(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalConfirmationOfPendingResolution> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmationofpendingresolutionGet()
  }

  async getConfirmationOfIllHealth(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalConfirmationOfIllHealth> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmationofillhealthGet()
  }
}
