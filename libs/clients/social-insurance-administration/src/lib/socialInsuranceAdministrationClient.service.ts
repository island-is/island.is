import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  ApplicationApi,
  CreateApplicationFromPaperReturn,
  GeneralApi,
  Document,
  ApplicantInfoReturn,
  IsEligibleForApplicationReturn,
} from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly applicationApi: ApplicationApi,
    private readonly applicantApi: ApplicantApi,
    private readonly currencyApi: GeneralApi,
  ) {}

  private applicationApiWithAuth = (user: User) =>
    this.applicationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private currencyApiWithAuth = (user: User) =>
    this.currencyApi.withMiddleware(new AuthMiddleware(user as Auth))

  sendApplication(
    user: User,
    //applicationDTO: ApplicationDTO,
    applicationType: string,
  ): Promise<CreateApplicationFromPaperReturn> {
    return this.applicationApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationTypePost({ applicationType })
  }

  sendAdditionalDocuments(
    user: User,
    applicationId: string,
    document: Array<Document>,
  ): Promise<void> {
    return this.applicationApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationGuidDocumentsPost({
      applicationGuid: applicationId,
      document,
    })
  }

  async getApplicant(user: User): Promise<ApplicantInfoReturn> {
    return this.applicantApiWithAuth(user).apiProtectedV1ApplicantGet()
  }

  async getIsEligible(
    user: User,
    applicationType: string,
  ): Promise<IsEligibleForApplicationReturn> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantApplicationTypeEligibleGet({ applicationType })
  }

  async getCurrencies(user: User): Promise<Array<string>> {
    return this.currencyApiWithAuth(user).apiProtectedV1GeneralCurrenciesGet()
  }
}
