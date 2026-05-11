import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  PersonalTaxCreditApi,
  TrWebApiServicesCommonClientsModelsGetTaxBracketReturn,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceDiscontinuePersonalTaxUsageInput,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceEditPersonalTaxAllowanceInput,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceGetTaxCardsReturn,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowancePersonalTaxAllowanceAction,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSetPersonalTaxAllowanceInput,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpousalTaxCardUsageYearMonthResult,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseInfoResult,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageDueToDeathInput,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageInput,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceTaxBracketAction,
  TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceYearWithMonthsDto,
} from '../../../gen/fetch/v1'
import { PersonalTaxCreditWriteApi } from '../socialInsuranceAdministrationClient.type'

@Injectable()
export class SocialInsuranceAdministrationPersonalTaxCreditService {
  constructor(
    private readonly personalTaxCreditApi: PersonalTaxCreditApi,
    private readonly personalTaxCreditWriteApi: PersonalTaxCreditWriteApi,
  ) {}

  private personalTaxCreditApiWithAuth = (user: User) =>
    this.personalTaxCreditApi.withMiddleware(new AuthMiddleware(user as Auth))

  private personalTaxCreditWriteApiWithAuth = (user: User) =>
    this.personalTaxCreditWriteApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getTaxAllowanceActions(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandPersonalTaxAllowancePersonalTaxAllowanceAction> {
    return this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxAllowanceActionsGet()
  }

  async getTaxCardMonthsAndYearsWhenDiscontinuing(
    user: User,
  ): Promise<
    | TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceYearWithMonthsDto[]
    | null
  > {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardMonthsAndYearsWhenDiscontinuingGet()
      .catch(handle404)
  }

  async getTaxCards(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceGetTaxCardsReturn | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardsGet()
      .catch(handle404)
  }

  async getTaxCardMonthsAndYears(
    user: User,
  ): Promise<
    | TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceYearWithMonthsDto[]
    | null
  > {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardMonthsAndYearsGet()
      .catch(handle404)
  }

  async getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpousalTaxCardUsageYearMonthResult | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditSpouseDeceasedTaxAllowanceValidMonthsAndYearsGet()
      .catch(handle404)
  }

  async setTaxCardAllowance(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSetPersonalTaxAllowanceInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSetTaxCardAllowancePost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceSetPersonalTaxAllowanceInput:
        input,
    })
  }

  async editTaxCardAllowance(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceEditPersonalTaxAllowanceInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditEditTaxCardAllowancePut({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceEditPersonalTaxAllowanceInput:
        input,
    })
  }

  async discontinueTaxCardAllowance(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceDiscontinuePersonalTaxUsageInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditDiscontinueTaxCardAllowancePost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceDiscontinuePersonalTaxUsageInput:
        input,
    })
  }

  async setSpouseTaxCard(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardPost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageInput:
        input,
    })
  }

  async setSpouseTaxCardDueToDeath(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageDueToDeathInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardDueToDeathPost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageDueToDeathInput:
        input,
    })
  }

  async getSpouseInfo(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseInfoResult | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditSpouseInfoGet()
      .catch(handle404)
  }

  async getTaxBracketActions(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceTaxBracketAction> {
    return this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxBracketActionsGet()
  }

  async getTaxBracket(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsGetTaxBracketReturn> {
    return this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxBracketGet()
  }

  async setTaxBracket(user: User, taxBracket: string): Promise<void> {
    await this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxBracketPost({ body: taxBracket })
  }
}
