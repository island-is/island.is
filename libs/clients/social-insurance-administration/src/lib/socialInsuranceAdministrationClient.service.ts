import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicationApi,
  ApplicantApi,
  GeneralApi,
  PaymentPlanApi,
  TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument,
  TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn,
  TrWebCommonsExternalPortalsApiModelsApplicationsIsEligibleForApplicationReturn,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments,
  PensionCalculatorApi,
  ApiProtectedV1PensionCalculatorPostRequest,
} from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly applicationApi: ApplicationApi,
    private readonly applicantApi: ApplicantApi,
    private readonly paymentPlanApi: PaymentPlanApi,
    private readonly currencyApi: GeneralApi,
    private readonly pensionCalculatorApi: PensionCalculatorApi,
  ) {}

  private applicationApiWithAuth = (user: User) =>
    this.applicationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private currencyApiWithAuth = (user: User) =>
    this.currencyApi.withMiddleware(new AuthMiddleware(user as Auth))

  private paymentPlanApiWithAuth = (user: User) =>
    this.paymentPlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  getPaymentPlan(
    user: User,
    year?: number,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return Promise.resolve({
      paymentPlan: {
        groups: [
          {
            name: '',
            group: 'Skattskyldar greiðslutegundir',
            groupId: 10,
            type: 'LAU',
            overviewType: 'A',
            order: '01-1.11-77',
            monthTotals: [
              {
                month: 0,
                amount: 232892,
              },
              {
                month: 1,
                amount: 232892,
              },
              {
                month: 2,
                amount: 232892,
              },
              {
                month: 3,
                amount: 232892,
              },
              {
                month: 4,
                amount: 232892,
              },
              {
                month: 5,
                amount: 232892,
              },
              {
                month: 6,
                amount: 21460,
              },
              {
                month: 7,
                amount: 151072,
              },
              {
                month: 8,
                amount: 151072,
              },
              {
                month: 9,
                amount: 232892,
              },
              {
                month: 10,
                amount: 232892,
              },
              {
                month: 11,
                amount: 32669,
              },
            ],
            rows: [
              {
                name: 'Örorkulífeyrir',
                months: [
                  {
                    month: 0,
                    amount: 46036,
                  },
                  {
                    month: 1,
                    amount: 46036,
                  },
                  {
                    month: 2,
                    amount: 46036,
                  },
                  {
                    month: 3,
                    amount: 46036,
                  },
                  {
                    month: 4,
                    amount: 46036,
                  },
                  {
                    month: 5,
                    amount: 46036,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 30484,
                  },
                  {
                    month: 8,
                    amount: 30484,
                  },
                  {
                    month: 9,
                    amount: 46036,
                  },
                  {
                    month: 10,
                    amount: 46036,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
              {
                name: 'Aldurstengd örorkuuppbót',
                months: [
                  {
                    month: 0,
                    amount: 46036,
                  },
                  {
                    month: 1,
                    amount: 46036,
                  },
                  {
                    month: 2,
                    amount: 46036,
                  },
                  {
                    month: 3,
                    amount: 46036,
                  },
                  {
                    month: 4,
                    amount: 46036,
                  },
                  {
                    month: 5,
                    amount: 46036,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 30484,
                  },
                  {
                    month: 8,
                    amount: 30484,
                  },
                  {
                    month: 9,
                    amount: 46036,
                  },
                  {
                    month: 10,
                    amount: 46036,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
              {
                name: 'Tekjutrygging örorkulífeyrisþega',
                months: [
                  {
                    month: 0,
                    amount: 140820,
                  },
                  {
                    month: 1,
                    amount: 140820,
                  },
                  {
                    month: 2,
                    amount: 140820,
                  },
                  {
                    month: 3,
                    amount: 140820,
                  },
                  {
                    month: 4,
                    amount: 140820,
                  },
                  {
                    month: 5,
                    amount: 140820,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 90104,
                  },
                  {
                    month: 8,
                    amount: 90104,
                  },
                  {
                    month: 9,
                    amount: 140820,
                  },
                  {
                    month: 10,
                    amount: 140820,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
              {
                name: 'Orlofsuppbót á tekjutryggingu',
                months: [
                  {
                    month: 0,
                    amount: 0,
                  },
                  {
                    month: 1,
                    amount: 0,
                  },
                  {
                    month: 2,
                    amount: 0,
                  },
                  {
                    month: 3,
                    amount: 0,
                  },
                  {
                    month: 4,
                    amount: 0,
                  },
                  {
                    month: 5,
                    amount: 0,
                  },
                  {
                    month: 6,
                    amount: 21460,
                  },
                  {
                    month: 7,
                    amount: 0,
                  },
                  {
                    month: 8,
                    amount: 0,
                  },
                  {
                    month: 9,
                    amount: 0,
                  },
                  {
                    month: 10,
                    amount: 0,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
              {
                name: 'Desemberuppbót á tekjutryggingu',
                months: [
                  {
                    month: 0,
                    amount: 0,
                  },
                  {
                    month: 1,
                    amount: 0,
                  },
                  {
                    month: 2,
                    amount: 0,
                  },
                  {
                    month: 3,
                    amount: 0,
                  },
                  {
                    month: 4,
                    amount: 0,
                  },
                  {
                    month: 5,
                    amount: 0,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 0,
                  },
                  {
                    month: 8,
                    amount: 0,
                  },
                  {
                    month: 9,
                    amount: 0,
                  },
                  {
                    month: 10,
                    amount: 0,
                  },
                  {
                    month: 11,
                    amount: 32669,
                  },
                ],
              },
            ],
          },
          {
            name: '',
            group: 'Óskattskyldar greiðslutegundir',
            monthTotals: [
              {
                month: 0,
                amount: 23293,
              },
              {
                month: 1,
                amount: 23293,
              },
              {
                month: 2,
                amount: 23293,
              },
              {
                month: 3,
                amount: 23293,
              },
              {
                month: 4,
                amount: 23293,
              },
              {
                month: 5,
                amount: 23293,
              },
              {
                month: 6,
                amount: 0,
              },
              {
                month: 7,
                amount: 23293,
              },
              {
                month: 8,
                amount: 23293,
              },
              {
                month: 9,
                amount: 23293,
              },
              {
                month: 10,
                amount: 23293,
              },
              {
                month: 11,
                amount: 0,
              },
            ],
            rows: [
              {
                name: 'Uppbót v/reksturs bifreiðar (örorkulífeyrir)- Óskattskyld',
                months: [
                  {
                    month: 0,
                    amount: 23293,
                  },
                  {
                    month: 1,
                    amount: 23293,
                  },
                  {
                    month: 2,
                    amount: 23293,
                  },
                  {
                    month: 3,
                    amount: 23293,
                  },
                  {
                    month: 4,
                    amount: 23293,
                  },
                  {
                    month: 5,
                    amount: 23293,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 23293,
                  },
                  {
                    month: 8,
                    amount: 23293,
                  },
                  {
                    month: 9,
                    amount: 23293,
                  },
                  {
                    month: 10,
                    amount: 23293,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
              {
                name: 'Aldurstengd örorkuuppbót',
                months: [
                  {
                    month: 0,
                    amount: 46036,
                  },
                  {
                    month: 1,
                    amount: 46036,
                  },
                  {
                    month: 2,
                    amount: 46036,
                  },
                  {
                    month: 3,
                    amount: 46036,
                  },
                  {
                    month: 4,
                    amount: 46036,
                  },
                  {
                    month: 5,
                    amount: 46036,
                  },
                  {
                    month: 6,
                    amount: 0,
                  },
                  {
                    month: 7,
                    amount: 30484,
                  },
                  {
                    month: 8,
                    amount: 30484,
                  },
                  {
                    month: 9,
                    amount: 46036,
                  },
                  {
                    month: 10,
                    amount: 46036,
                  },
                  {
                    month: 11,
                    amount: 0,
                  },
                ],
              },
            ],
          },
          {
            name: '',
            group: 'Frádráttur',
            monthTotals: [
              {
                month: 0,
                amount: 88383,
              },
              {
                month: 1,
                amount: 88522,
              },
              {
                month: 2,
                amount: 88452,
              },
              {
                month: 3,
                amount: 88452,
              },
              {
                month: 4,
                amount: 88452,
              },
              {
                month: 5,
                amount: 88452,
              },
              {
                month: 6,
                amount: 8151,
              },
              {
                month: 7,
                amount: 57377,
              },
              {
                month: 8,
                amount: 57377,
              },
              {
                month: 9,
                amount: 88452,
              },
              {
                month: 10,
                amount: 88452,
              },
              {
                month: 11,
                amount: 12408,
              },
            ],
            rows: [
              {
                name: 'Staðgreiðsla',
                months: [
                  {
                    month: 0,
                    amount: 88383,
                  },
                  {
                    month: 1,
                    amount: 88522,
                  },
                  {
                    month: 2,
                    amount: 88452,
                  },
                  {
                    month: 3,
                    amount: 88452,
                  },
                  {
                    month: 4,
                    amount: 88452,
                  },
                  {
                    month: 5,
                    amount: 88452,
                  },
                  {
                    month: 6,
                    amount: 8151,
                  },
                  {
                    month: 7,
                    amount: 57377,
                  },
                  {
                    month: 8,
                    amount: 57377,
                  },
                  {
                    month: 9,
                    amount: 88452,
                  },
                  {
                    month: 10,
                    amount: 88452,
                  },
                  {
                    month: 11,
                    amount: 12408,
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    /*return this.paymentPlanApiWithAuth(user).apiProtectedV1PaymentPlanGet({
      year: year ? year.toString() : undefined,
    })*/
  }

  getPayments(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments> {
    return this.paymentPlanApiWithAuth(
      user,
    ).apiProtectedV1PaymentPlanLegitimatepaymentsGet()
  }

  sendApplication(
    user: User,
    applicationDTO: object,
    applicationType: string,
  ): Promise<TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn> {
    return this.applicationApiWithAuth(
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
    return this.applicationApiWithAuth(
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
    ).apiProtectedV1ApplicantApplicationTypeEligibleGet({ applicationType })
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
}
