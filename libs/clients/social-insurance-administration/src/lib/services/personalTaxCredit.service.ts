import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FetchError, handle404 } from '@island.is/clients/middlewares'
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

  private extractErrorCode(error: unknown): string | null {
    if (error instanceof FetchError) {
      const errorBody = (error.problem ?? error.body) as
        | { detail?: string }
        | undefined
      return errorBody?.detail ?? null
    }
    return null
  }

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
      .catch((e) => {
        if (!(e instanceof FetchError)) throw e
        const code = this.extractErrorCode(e)
        if (!code) throw e
        return {
          canApply: false,
          reasonNotAllowed: code,
          allowedYearMonths: [],
        } as TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpousalTaxCardUsageYearMonthResult
      })
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
    const result = await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardPost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageInput:
        input,
    })
    if (result.success === false) {
      throw new Error('spouse tax card update failed')
    }
  }

  async setSpouseTaxCardDueToDeath(
    user: User,
    input: TrWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageDueToDeathInput,
  ): Promise<void> {
    const result = await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardDueToDeathPost({
      trWebContractsExternalDigitalIcelandPersonalTaxAllowanceSpouseTaxCardUsageDueToDeathInput:
        input,
    })
    if (result.success === false) {
      throw new Error('spouse tax card due to death update failed')
    }
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
