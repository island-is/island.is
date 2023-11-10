import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  OldAgePension,
  SendApplicationApi,
  OldAgePensionResponse,
  GetIsApplicantEligibleApi,
  Eligible,
  GetApplicantInfoApi,
  Applicant,
} from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly sendApplicationApi: SendApplicationApi,
    private readonly getIsApplicantEligibleApi: GetIsApplicantEligibleApi,
    private readonly getApplicantInfoApi: GetApplicantInfoApi,
  ) {}

  private sendAPIWithAuth = (user: User) =>
    this.sendApplicationApi.withMiddleware(new AuthMiddleware(user as Auth))
  private isEligibleAPIWithAuth = (user: User) =>
    this.getIsApplicantEligibleApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )
  private applicantAPIWithAuth = (user: User) =>
    this.getApplicantInfoApi.withMiddleware(new AuthMiddleware(user as Auth))

  async sendApplication(
    user: User,
    oldAgePension: OldAgePension,
    applicationType: string,
  ): Promise<OldAgePensionResponse> {
    return await this.sendAPIWithAuth(user).oldAgePensionSendApplication({
      oldAgePension,
      applicationType,
    })
  }

  async getApplicant(user: User): Promise<Applicant> {
    return await this.applicantAPIWithAuth(user).applicationGetApplicant()
  }

  async getIsEligible(user: User, applicationType: string): Promise<Eligible> {
    return await this.isEligibleAPIWithAuth(user).applicantGetIsEligible({
      applicationType,
    })
  }
}
