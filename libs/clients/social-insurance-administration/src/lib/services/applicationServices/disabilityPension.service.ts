import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { ApplicationApi as ApplicationWriteApiV2 } from '../../../../gen/fetch/v2'
import { DisabilityPensionDto } from '../../dto'
import { TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn } from '../../..'
import { SocialInsuranceAdministrationGeneralApplicationService } from './generalApplication.service'
import {
  MedicalDocumentApiForDisabilityPension,
  QuestionnairesApiForDisabilityPension,
} from '../../socialInsuranceAdministrationClient.type'
import { TrWebContractsExternalServicePortalDisabilityPensionCertificate } from '../../../../gen/fetch/v1'
import { INCOME_PLAN_APPLICATION_SLUG } from '../../constants'

@Injectable()
export class SocialInsuranceAdministrationDisabilityPensionService {
  constructor(
    private readonly applicationWriteApiV2: ApplicationWriteApiV2,
    private readonly applicationService: SocialInsuranceAdministrationGeneralApplicationService,
    private readonly medicalDocumentsApi: MedicalDocumentApiForDisabilityPension,
    private readonly questionnairesApi: QuestionnairesApiForDisabilityPension,
  ) {}

  private applicationWriteApiV2WithAuth = (user: User) =>
    this.applicationWriteApiV2.withMiddleware(new AuthMiddleware(user as Auth))

  private medicalDocumentsApiWithAuth = (user: User) =>
    this.medicalDocumentsApi.withMiddleware(new AuthMiddleware(user as Auth))

  questionnairesApiWithAuth = (user: User) =>
    this.questionnairesApi.withMiddleware(new AuthMiddleware(user as Auth))

  async sendDisabilityPensionApplication(
    user: User,
    input: DisabilityPensionDto,
  ): Promise<void> {
    return this.applicationWriteApiV2WithAuth(
      user,
    ).apiProtectedV2ApplicationApplicationTypePost({
      applicationType: INCOME_PLAN_APPLICATION_SLUG,
      body: input,
    })
  }

  async isUserEligibleForDisabilityPension(
    user: User,
  ): Promise<TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn> {
    return this.applicationService.getIsEligible(
      user,
      INCOME_PLAN_APPLICATION_SLUG,
    )
  }

  async getCertificateForDisabilityPension(
    user: User,
  ): Promise<TrWebContractsExternalServicePortalDisabilityPensionCertificate> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsDisabilitypensioncertificateGet()
  }

  async getSelfAssessmentQuestionnaire(user: User, languages: Array<string>) {
    return this.questionnairesApiWithAuth(
      user,
    ).apiProtectedV1QuestionnairesDisabilitypensionSelfassessmentGet({
      languages,
    })
  }
}
