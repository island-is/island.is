import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  PersonalTaxCreditApi,
  TrWebApiServicesCommonClientsEnumsPersonalTaxAllowanceAction,
  TrWebApiServicesCommonClientsEnumsTaxBracketAction,
  TrWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput,
  TrWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsGetTaxBracketReturn,
  TrWebApiServicesCommonClientsModelsYearWithMonthsDto,
  TrWebApiServicesCommonClientsModelsGetTaxCardsReturn,
  TrWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsSpousalTaxCardUsageYearMonthResult,
  TrWebApiServicesCommonClientsModelsSpouseInfoResult,
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
  ): Promise<TrWebApiServicesCommonClientsEnumsPersonalTaxAllowanceAction> {
    return this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxAllowanceActionsGet()
  }

  async getTaxCardMonthsAndYearsWhenDiscontinuing(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsYearWithMonthsDto[] | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardMonthsAndYearsWhenDiscontinuingGet()
      .catch(handle404)
  }

  async getTaxCards(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsGetTaxCardsReturn | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardsGet()
      .catch(handle404)
  }

  async getTaxCardMonthsAndYears(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsYearWithMonthsDto[] | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardMonthsAndYearsGet()
      .catch(handle404)
  }

  async getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsSpousalTaxCardUsageYearMonthResult | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditSpouseDeceasedTaxAllowanceValidMonthsAndYearsGet()
      .catch(handle404)
  }

  async setTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSetTaxCardAllowancePost({
      trWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput: input,
    })
  }

  async editTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditEditTaxCardAllowancePut({
      trWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput: input,
    })
  }

  async discontinueTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditDiscontinueTaxCardAllowancePost({
      trWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput:
        input,
    })
  }

  async getSpouseInfo(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsSpouseInfoResult | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditSpouseInfoGet()
      .catch(handle404)
  }

  async getTaxBracketActions(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsEnumsTaxBracketAction> {
    return this.personalTaxCreditApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxBracketActionsGet()
  }

  async getTaxBracket(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsGetTaxBracketReturn | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxBracketGet()
      .catch(handle404)
  }

  async setTaxBracket(user: User, taxBracket: string): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditTaxBracketPost({ body: taxBracket })
  }
}
