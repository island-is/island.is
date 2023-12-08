import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  OldAgePension,
  SendApplicationApi,
  Response,
  GetIsApplicantEligibleApi,
  Eligible,
  GetApplicantInfoApi,
  Applicant,
  GetCurrenciesApi,
  SendAdditionalDocumentsApi,
  Attachment,
} from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly sendApplicationApi: SendApplicationApi,
    private readonly getIsApplicantEligibleApi: GetIsApplicantEligibleApi,
    private readonly getApplicantInfoApi: GetApplicantInfoApi,
    private readonly getCurrenciesApi: GetCurrenciesApi,
    private readonly sendAdditionalDocumentsApi: SendAdditionalDocumentsApi,
  ) {}

  private sendAPIWithAuth = (user: User) =>
    this.sendApplicationApi.withMiddleware(new AuthMiddleware(user as Auth))
  private isEligibleAPIWithAuth = (user: User) =>
    this.getIsApplicantEligibleApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )
  private applicantAPIWithAuth = (user: User) =>
    this.getApplicantInfoApi.withMiddleware(new AuthMiddleware(user as Auth))
  private currenciesAPIWithAuth = (user: User) =>
    this.getCurrenciesApi.withMiddleware(new AuthMiddleware(user as Auth))
  private sendDocumentsAPIWithAuth = (user: User) =>
    this.sendAdditionalDocumentsApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  sendApplication(
    user: User,
    oldAgePension: OldAgePension,
    applicationType: string,
  ): Promise<Response> {
    return this.sendAPIWithAuth(user).oldAgePensionSendApplication({
      oldAgePension,
      applicationType,
    })
  }

  sendAdditionalDocuments(
    user: User,
    applicationId: string,
    attachment: Array<Attachment>,
  ): Promise<void> {
    return this.sendDocumentsAPIWithAuth(user).sendDocuments({
      applicationId,
      attachment,
    })
  }

  async getApplicant(user: User): Promise<Applicant> {
    const applicant = await this.applicantAPIWithAuth(
      user,
    ).applicationGetApplicant()
    return applicant
  }

  async getIsEligible(user: User, applicationType: string): Promise<Eligible> {
    const isEligible = await this.isEligibleAPIWithAuth(
      user,
    ).applicantGetIsEligible({
      applicationType,
    })
    return isEligible
  }

  async getCurrencies(user: User): Promise<Array<string>> {
    const currencies = await this.currenciesAPIWithAuth(
      user,
    ).generalGetCurrencies()
    return currencies
  }
}
