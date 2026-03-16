import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  QuestionnairesApi,
  TrWebApiServicesDomainApplicationsModelsApplicationTypeDto,
  TrWebApiServicesDomainQuestionnairesModelsQuestionnaireDto,
} from '../../../../gen/fetch/v1'
import { ApplicationApi as ApplicationWriteApiV2 } from '../../../../gen/fetch/v2'
import { MEDICAL_AND_REHABILITATION_PAYMENTS_SLUG } from '../../constants'
import { SocialInsuranceAdministrationGeneralApplicationService } from './generalApplication.service'
import { MedicalAndRehabilitationPaymentsDTO } from '../../dto/medicalAndRehabilitationPayments.dto'

@Injectable()
export class SocialInsuranceAdministrationMedicalAndRehabilitationService {
  constructor(
    private readonly applicantApi: ApplicantApi,
    private readonly questionnairesApi: QuestionnairesApi,
    private readonly applicationService: SocialInsuranceAdministrationGeneralApplicationService,
  ) {}

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private questionnairesApiWithAuth = (user: User) =>
    this.questionnairesApi.withMiddleware(new AuthMiddleware(user as Auth))

  async sendMedicalAndRehabilitationPaymentsApplication(
    user: User,
    applicationDTO: MedicalAndRehabilitationPaymentsDTO,
  ): Promise<void> {
    return this.applicationService.sendApplicationV2(
      user,
      applicationDTO,
      MEDICAL_AND_REHABILITATION_PAYMENTS_SLUG,
    )
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
