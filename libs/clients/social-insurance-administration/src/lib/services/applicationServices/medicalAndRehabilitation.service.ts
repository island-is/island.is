import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  QuestionnairesApi,
  TrWebApiServicesDomainApplicationsModelsApplicationTypeDto,
  TrWebApiServicesDomainQuestionnairesModelsQuestionnaireDto,
} from '../../../../gen/fetch/v1'
import { ApplicationApi as ApplicationWriteApiV2 } from '../../../../gen/fetch/v2'

@Injectable()
export class SocialInsuranceAdministrationMedicalAndRehabilitationService {
  constructor(
    private readonly applicantApi: ApplicantApi,
    private readonly questionnairesApi: QuestionnairesApi,
    private readonly applicationWriteApiV2: ApplicationWriteApiV2,
  ) {}

  private applicationWriteApiV2WithAuth = (user: User) =>
    this.applicationWriteApiV2.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private questionnairesApiWithAuth = (user: User) =>
    this.questionnairesApi.withMiddleware(new AuthMiddleware(user as Auth))

  async sendMedicalAndRehabilitationPaymentsApplication(
    user: User,
    applicationDTO: object,
    applicationType: string,
  ): Promise<void> {
    return this.applicationWriteApiV2WithAuth(
      user,
    ).apiProtectedV2ApplicationApplicationTypePost({
      applicationType,
      body: applicationDTO,
    })
  }

  async getMedicalAndRehabilitationApplicationType(
    user: User,
  ): Promise<TrWebApiServicesDomainApplicationsModelsApplicationTypeDto> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantMedicalandrehabilitationpaymentsTypeGet()
  }

  async getSelfAssessmentQuestionnaire(
    user: User,
    languages: Array<string>,
  ): Promise<
    Array<TrWebApiServicesDomainQuestionnairesModelsQuestionnaireDto>
  > {
    return this.questionnairesApiWithAuth(
      user,
    ).apiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGet(
      { languages },
    )
  }
}
