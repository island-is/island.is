import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn,
  TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn,
  TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn,
  TrWebContractsExternalDigitalIcelandDocumentsDocument,
  TrWebContractsExternalServicePortalNationalRegistryAddress,
} from '../../../../gen/fetch/v1'
import { ApplicationWriteApi } from '../../socialInsuranceAdministrationClient.type'

@Injectable()
export class SocialInsuranceAdministrationGeneralApplicationService {
  constructor(
    private readonly applicationWriteApi: ApplicationWriteApi,
    private readonly applicantApi: ApplicantApi,
  ) {}

  private applicationWriteApiWithAuth = (user: User) =>
    this.applicationWriteApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  sendApplication(
    user: User,
    applicationDTO: object,
    applicationType: string,
  ): Promise<TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationTypePost({
      applicationType,
      body: applicationDTO,
    })
  }

  sendAdditionalDocuments(
    user: User,
    applicationId: string,
    documents: Array<TrWebContractsExternalDigitalIcelandDocumentsDocument>,
  ): Promise<void> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationGuidDocumentsPost({
      applicationGuid: applicationId,
      trWebContractsExternalDigitalIcelandDocumentsDocument: documents,
    })
  }

  async getApplicant(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn> {
    return this.applicantApiWithAuth(user).apiProtectedV1ApplicantGet()
  }

  async getIsEligible(
    user: User,
    applicationType: string,
  ): Promise<TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantApplicationTypeEligibleGet({
      applicationType,
    })
  }

  async getResidenceInformation(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalNationalRegistryAddress> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantResidenceInformationGet()
  }
}
