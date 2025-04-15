import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiProtectedV1IncomePlanTemporaryCalculationsPostRequest,
  ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ApiProtectedV1PensionCalculatorPostRequest,
  ApplicantApi,
  ApplicationApi,
  GeneralApi,
  IncomePlanApi,
  PaymentPlanApi,
  PensionCalculatorApi,
  DeathBenefitsApi,
  TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn,
  TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn,
  TrWebCommonsExternalPortalsApiModelsApplicationsIsEligibleForApplicationReturn,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument,
  TrWebCommonsExternalPortalsApiModelsIncomePlanExternalIncomeTypeDto,
  TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanConditionsDto,
  TrWebCommonsExternalPortalsApiModelsIncomePlanWithholdingTaxDto,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
  TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'
import { ApplicationWriteApi } from './socialInsuranceAdministrationClient.type'
import { IncomePlanDto, mapIncomePlanDto } from './dto/incomePlan.dto'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly applicationApi: ApplicationApi,
    private readonly applicationWriteApi: ApplicationWriteApi,
    private readonly applicantApi: ApplicantApi,
    private readonly paymentPlanApi: PaymentPlanApi,
    private readonly currencyApi: GeneralApi,
    private readonly pensionCalculatorApi: PensionCalculatorApi,
    private readonly deathBenefitsApi: DeathBenefitsApi,
    private readonly incomePlanApi: IncomePlanApi,
  ) {}

  private applicationApiWithAuth = (user: User) =>
    this.applicationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicationWriteApiWithAuth = (user: User) =>
    this.applicationWriteApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private currencyApiWithAuth = (user: User) =>
    this.currencyApi.withMiddleware(new AuthMiddleware(user as Auth))

  private paymentPlanApiWithAuth = (user: User) =>
    this.paymentPlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  private deathBenefitsApiWithAuth = (user: User) =>
    this.deathBenefitsApi.withMiddleware(new AuthMiddleware(user as Auth))

  private incomePlanApiWithAuth = (user: User) =>
    this.incomePlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  getPaymentPlan(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return Promise.resolve({
      totalPayment: 4578995,
      subtracted: 1127507,
      paidOut: 3451488,
      groups: [
        {
          group: 'Skattskyldar greiðslutegundir',
          groupId: 10,
          total: 4578995,
          monthTotals: [
            {
              month: 1,
              amount: 370517,
            },
            {
              month: 2,
              amount: 370517,
            },
            {
              month: 3,
              amount: 370517,
            },
            {
              month: 4,
              amount: 370517,
            },
            {
              month: 5,
              amount: 370517,
            },
            {
              month: 6,
              amount: 370517,
            },
            {
              month: 7,
              amount: 423634,
            },
            {
              month: 8,
              amount: 370517,
            },
            {
              month: 9,
              amount: 370517,
            },
            {
              month: 10,
              amount: 370517,
            },
            {
              month: 11,
              amount: 370517,
            },
            {
              month: 12,
              amount: 450191,
            },
          ],
          rows: [
            {
              name: 'Ellilífeyrir',
              total: 4446204,
              months: [
                {
                  month: 1,
                  amount: 370517,
                },
                {
                  month: 2,
                  amount: 370517,
                },
                {
                  month: 3,
                  amount: 370517,
                },
                {
                  month: 4,
                  amount: 370517,
                },
                {
                  month: 5,
                  amount: 370517,
                },
                {
                  month: 6,
                  amount: 370517,
                },
                {
                  month: 7,
                  amount: 370517,
                },
                {
                  month: 8,
                  amount: 370517,
                },
                {
                  month: 9,
                  amount: 370517,
                },
                {
                  month: 10,
                  amount: 370517,
                },
                {
                  month: 11,
                  amount: 370517,
                },
                {
                  month: 12,
                  amount: 370517,
                },
              ],
            },
            {
              name: 'Orlofs- og desemberuppbót á ellilífeyri',
              total: 132791,
              months: [
                {
                  month: 7,
                  amount: 53117,
                },
                {
                  month: 12,
                  amount: 79674,
                },
              ],
            },
          ],
        },
        {
          group: 'Frádráttur',
          groupId: 20,
          total: 1127507,
          monthTotals: [
            {
              month: 1,
              amount: 105160,
            },
            {
              month: 2,
              amount: 105161,
            },
            {
              month: 3,
              amount: 86675,
            },
            {
              month: 4,
              amount: 86675,
            },
            {
              month: 5,
              amount: 86675,
            },
            {
              month: 6,
              amount: 86676,
            },
            {
              month: 7,
              amount: 106849,
            },
            {
              month: 8,
              amount: 86675,
            },
            {
              month: 9,
              amount: 86675,
            },
            {
              month: 10,
              amount: 86676,
            },
            {
              month: 11,
              amount: 86675,
            },
            {
              month: 12,
              amount: 116935,
            },
          ],
          rows: [
            {
              name: 'Innborgun á kröfur',
              total: 36970,
              months: [
                {
                  month: 1,
                  amount: 18485,
                },
                {
                  month: 2,
                  amount: 18485,
                },
              ],
            },
            {
              name: 'Staðgreiðsla',
              total: 1090537,
              months: [
                {
                  month: 1,
                  amount: 86675,
                },
                {
                  month: 2,
                  amount: 86676,
                },
                {
                  month: 3,
                  amount: 86675,
                },
                {
                  month: 4,
                  amount: 86675,
                },
                {
                  month: 5,
                  amount: 86675,
                },
                {
                  month: 6,
                  amount: 86676,
                },
                {
                  month: 7,
                  amount: 106849,
                },
                {
                  month: 8,
                  amount: 86675,
                },
                {
                  month: 9,
                  amount: 86675,
                },
                {
                  month: 10,
                  amount: 86676,
                },
                {
                  month: 11,
                  amount: 86675,
                },
                {
                  month: 12,
                  amount: 116935,
                },
              ],
            },
          ],
        },
        {
          group: 'Ráðstöfun',
          groupId: 30,
          total: 3451488,
          monthTotals: [
            {
              month: 1,
              amount: 265357,
            },
            {
              month: 2,
              amount: 265356,
            },
            {
              month: 3,
              amount: 283842,
            },
            {
              month: 4,
              amount: 283842,
            },
            {
              month: 5,
              amount: 283842,
            },
            {
              month: 6,
              amount: 283841,
            },
            {
              month: 7,
              amount: 316785,
            },
            {
              month: 8,
              amount: 283842,
            },
            {
              month: 9,
              amount: 283842,
            },
            {
              month: 10,
              amount: 283841,
            },
            {
              month: 11,
              amount: 283842,
            },
            {
              month: 12,
              amount: 333256,
            },
          ],
          rows: [
            {
              name: 'Til greiðslu',
              total: 3451488,
              months: [
                {
                  month: 1,
                  amount: 265357,
                },
                {
                  month: 2,
                  amount: 265356,
                },
                {
                  month: 3,
                  amount: 283842,
                },
                {
                  month: 4,
                  amount: 283842,
                },
                {
                  month: 5,
                  amount: 283842,
                },
                {
                  month: 6,
                  amount: 283841,
                },
                {
                  month: 7,
                  amount: 316785,
                },
                {
                  month: 8,
                  amount: 283842,
                },
                {
                  month: 9,
                  amount: 283842,
                },
                {
                  month: 10,
                  amount: 283841,
                },
                {
                  month: 11,
                  amount: 283842,
                },
                {
                  month: 12,
                  amount: 333256,
                },
              ],
            },
          ],
        },
      ],
    })

    /*return this.paymentPlanApiWithAuth(user).apiProtectedV1PaymentPlanGet({
      year: undefined,
    })*/
  }

  async getPayments(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments | null> {
    return Promise.resolve({
      nextPayment: 100000,
      previousPayment: 5000,
    })

    /*return await this.paymentPlanApiWithAuth(user)
      .apiProtectedV1PaymentPlanLegitimatepaymentsGet()
      .catch(handle404)
      */
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

  async getIncomePlanConditions(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanConditionsDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanIncomePlanConditionsGet()
  }

  sendApplication(
    user: User,
    applicationDTO: object,
    applicationType: string,
  ): Promise<TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationTypePost({
      applicationType,
      body: applicationDTO,
    })
  }

  sendAdditionalDocuments(
    user: User,
    applicationId: string,
    documents: Array<TrWebCommonsExternalPortalsApiModelsDocumentsDocument>,
  ): Promise<void> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationGuidDocumentsPost({
      applicationGuid: applicationId,
      trWebCommonsExternalPortalsApiModelsDocumentsDocument: documents,
    })
  }

  async getApplicant(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn> {
    return this.applicantApiWithAuth(user).apiProtectedV1ApplicantGet()
  }

  async getIsEligible(
    user: User,
    applicationType: string,
  ): Promise<TrWebCommonsExternalPortalsApiModelsApplicationsIsEligibleForApplicationReturn> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantApplicationTypeEligibleGet({
      applicationType,
    })
  }

  async getCurrencies(user: User): Promise<Array<string>> {
    return this.currencyApiWithAuth(user).apiProtectedV1GeneralCurrenciesGet()
  }

  async getPensionCalculation(
    parameters: ApiProtectedV1PensionCalculatorPostRequest['trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput'],
  ) {
    return this.pensionCalculatorApi.apiProtectedV1PensionCalculatorPost({
      trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput:
        parameters,
    })
  }

  async getSpousalInfo(
    user: User,
  ): Promise<TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo> {
    return this.deathBenefitsApiWithAuth(
      user,
    ).apiProtectedV1DeathBenefitsSpousalinfoGet()
  }

  async getCategorizedIncomeTypes(
    user: User,
  ): Promise<
    Array<TrWebCommonsExternalPortalsApiModelsIncomePlanExternalIncomeTypeDto>
  > {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanCategorizedIncomeTypesGet()
  }

  async getWithholdingTax(
    user: User,
    year: ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ): Promise<TrWebCommonsExternalPortalsApiModelsIncomePlanWithholdingTaxDto> {
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
}
