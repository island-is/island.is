import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { handle404 } from '@island.is/clients/middlewares'
import {
  IncomePlanApi,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
  ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ApiProtectedV1IncomePlanTemporaryCalculationsPostRequest,
  TrWebContractsExternalDigitalIcelandIncomePlanIncomePlanConditionsDto,
  TrWebContractsExternalDigitalIcelandIncomePlanExternalIncomeTypeDto,
  TrWebContractsExternalDigitalIcelandIncomePlanWithholdingTaxDto,
  TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn,
} from '../../../gen/fetch/v1'
import { IncomePlanDto, mapIncomePlanDto } from '../dto/incomePlan.dto'
import { SocialInsuranceAdministrationGeneralApplicationService } from './applicationServices/generalApplication.service'
import { INCOME_PLAN_APPLICATION_SLUG } from '../constants'

@Injectable()
export class SocialInsuranceAdministrationIncomePlanService {
  constructor(
    private readonly incomePlanApi: IncomePlanApi,
    private readonly applicationService: SocialInsuranceAdministrationGeneralApplicationService,
  ) {}

  private incomePlanApiWithAuth = (user: User) =>
    this.incomePlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getIncomePlanConditions(
    user: User,
  ): Promise<TrWebContractsExternalDigitalIcelandIncomePlanIncomePlanConditionsDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanIncomePlanConditionsGet()
  }

  async getCategorizedIncomeTypes(
    user: User,
  ): Promise<
    Array<TrWebContractsExternalDigitalIcelandIncomePlanExternalIncomeTypeDto>
  > {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanCategorizedIncomeTypesGet()
  }

  async getWithholdingTax(
    user: User,
    year: ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ): Promise<TrWebContractsExternalDigitalIcelandIncomePlanWithholdingTaxDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanWithholdingTaxGet(year)
  }

  async getTemporaryCalculations(
    user: User,
    parameters: ApiProtectedV1IncomePlanTemporaryCalculationsPostRequest['trWebApiServicesDomainFinanceModelsIslandIsIncomePlanDto'],
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanTemporaryCalculationsPost({
      trWebApiServicesDomainFinanceModelsIslandIsIncomePlanDto: parameters,
    })
  }

  async getLatestIncomePlan(user: User): Promise<IncomePlanDto | null> {
    const incomePlan = await this.incomePlanApiWithAuth(user)
      .apiProtectedV1IncomePlanLatestIncomePlanGet()
      .catch(handle404)

    if (!incomePlan) {
      return null
    }

    return mapIncomePlanDto(incomePlan) ?? null
  }

  async isUserEligibleForIncomePlan(
    user: User,
  ): Promise<TrWebApiServicesDomainApplicationsModelsIsEligibleForApplicationReturn> {
    return this.applicationService.getIsEligible(
      user,
      INCOME_PLAN_APPLICATION_SLUG,
    )
  }
}
