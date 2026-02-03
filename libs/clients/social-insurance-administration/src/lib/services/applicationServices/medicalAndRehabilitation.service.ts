import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  QuestionnairesApi,
  TrWebApiServicesDomainApplicationsModelsApplicationTypeDto,
} from '../../../../gen/fetch/v1'

@Injectable()
export class SocialInsuranceAdministrationMedicalAndRehabilitationService {
  constructor(
    private readonly applicantApi: ApplicantApi,
    private readonly questionnairesApi: QuestionnairesApi,
  ) {}

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private questionnairesApiWithAuth = (user: User) =>
    this.questionnairesApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getMedicalAndRehabilitationApplicationType(
    user: User,
  ): Promise<TrWebApiServicesDomainApplicationsModelsApplicationTypeDto> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantMedicalandrehabilitationpaymentsTypeGet()
  }

  async getSelfAssessmentQuestionnaire(user: User, languages: Array<string>) {
    return this.questionnairesApiWithAuth(
      user,
    ).apiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGet(
      { languages },
    )
  }
}
