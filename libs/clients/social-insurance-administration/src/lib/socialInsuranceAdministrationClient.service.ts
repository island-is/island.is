import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  OldAgePension,
  SendApplicationApi,
  OldAgePensionResponse,
  BankInfo,
  GetBankInfoApi,
  SpouseInNursingHome,
  GetSpouseInNursingHomeApi,
  GetIsApplicantEligibleApi,
  Eligible,
} from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly sendApplicationApi: SendApplicationApi,
    private readonly getBankInfoApi: GetBankInfoApi,
    private readonly getSpouseInNursingHomeApi: GetSpouseInNursingHomeApi,
    private readonly getIsApplicantEligibleApi: GetIsApplicantEligibleApi,
  ) {}

  private sendAPIWithAuth = (user: User) =>
    this.sendApplicationApi.withMiddleware(new AuthMiddleware(user as Auth))
  private bankInfoAPIWithAuth = (user: User) =>
    this.getBankInfoApi.withMiddleware(new AuthMiddleware(user as Auth))

  private spouseInNursingHomeAPIWithAuth = (user: User) =>
    this.getSpouseInNursingHomeApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )
  private isEligibleAPIWithAuth = (user: User) =>
    this.getIsApplicantEligibleApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

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

  async getBankInfo(user: User): Promise<BankInfo> {
    return await this.bankInfoAPIWithAuth(user).applicationGetBankInfo()
  }

  async getSpouseInNursingHome(user: User): Promise<SpouseInNursingHome> {
    return await this.spouseInNursingHomeAPIWithAuth(
      user,
    ).applicationGetSpouseInNursingHome()
  }

  async getIsEligible(user: User, applicationType: string): Promise<Eligible> {
    return await this.isEligibleAPIWithAuth(user).applicantGetIsEligible({
      applicationType,
    })
  }
}
