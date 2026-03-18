import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  PersonalTaxCreditApi,
  TrWebApiServicesCommonClientsEnumsPersonalTaxAllowanceAction,
  TrWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput,
  TrWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsYearWithMonthsDto,
  TrWebApiServicesCommonClientsModelsGetTaxCardsReturn,
  TrWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsSpousalTaxCardUsageYearMonthResult,
  TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageDueToDeathInput,
  TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageInput,
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
    ).apiProtectedV1PersonalTaxCreditGetTaxAllowanceActionsGet()
  }

  async getTaxCards(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsGetTaxCardsReturn | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardsGet()
      .catch((error) => {
        if (error?.status === 404) return null
        throw error
      })
  }

  async getTaxCardMonthsAndYears(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsYearWithMonthsDto[] | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditTaxCardMonthsAndYearsGet()
      .catch((error) => {
        if (error?.status === 404) return null
        throw error
      })
  }

  async getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
    user: User,
  ): Promise<TrWebApiServicesCommonClientsModelsSpousalTaxCardUsageYearMonthResult | null> {
    return this.personalTaxCreditApiWithAuth(user)
      .apiProtectedV1PersonalTaxCreditSpouseDeceasedTaxAllowanceValidMonthsAndYearsGet()
      .catch((error) => {
        if (error?.status === 404 || error?.status === 400) return null
        throw error
      })
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

  async setSpouseTaxCard(
    user: User,
    input: TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardPost({
      trWebApiServicesCommonClientsModelsSpouseTaxCardUsageInput: input,
    })
  }

  async setSpouseTaxCardDueToDeath(
    user: User,
    input: TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageDueToDeathInput,
  ): Promise<void> {
    await this.personalTaxCreditWriteApiWithAuth(
      user,
    ).apiProtectedV1PersonalTaxCreditSpouseTaxCardDueToDeathPost({
      trWebApiServicesCommonClientsModelsSpouseTaxCardUsageDueToDeathInput:
        input,
    })
  }
}
