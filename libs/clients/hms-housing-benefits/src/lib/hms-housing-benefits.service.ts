import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiVversionPaymentPaymenthistoryPostRequest,
  ApplicationApi,
  HousingBenefitsApplicationModel,
  PaymentApi,
  TaxApi,
} from '../../gen/fetch'
import { handle204 } from '@island.is/clients/middlewares'
import { CalculationTypes, TransactionTypes } from './enums'

@Injectable()
export class HmsHousingBenefitsClientService {
  constructor(
    private readonly paymentApi: PaymentApi,
    private readonly applicationApi: ApplicationApi,
    private readonly taxApi: TaxApi,
  ) {}

  private apiWithAuth = (user: User) =>
    this.paymentApi.withMiddleware(new AuthMiddleware(user as Auth))

  async createHousingBenefitsApplication(
    user: User,
    model: HousingBenefitsApplicationModel,
  ) {
    return this.applicationApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiVversionApplicationCreateHousingBenefitsApplicationPost({
        version: '1',
        housingBenefitsApplicationModel: model,
      })
  }

  async hasTaxReturnForYear(auth: Auth, nationalId: string, year: number) {
    return this.taxApi
      .withMiddleware(new AuthMiddleware(auth))
      .hasTaxReturnForYear({
        version: '1',
        kennitala: nationalId,
        year,
      })
  }

  async hasTaxReturnLastFiveYears(auth: Auth, nationalId: string) {
    return this.taxApi
      .withMiddleware(new AuthMiddleware(auth))
      .hasTaxReturnLastFiveYears({
        version: '1',
        kennitala: nationalId,
      })
  }

  async hmsPaymentHistory(
    user: User,
    input: ApiVversionPaymentPaymenthistoryPostRequest,
  ) {
    const res = await handle204(
      this.apiWithAuth(user).apiVversionPaymentPaymenthistoryPostRaw(input),
    )

    const roundIfDefined = function (
      value: number | undefined | null,
    ): number | undefined {
      return typeof value === 'number' ? Math.round(value) : undefined
    }

    if (!res) return null
    return {
      ...res,
      totalCount: res.totalCount ?? 0,
      pageInfo: {
        ...res.pageInfo,
        hasNextPage: !!res.pageInfo?.hasNextPage,
      },
      data:
        res.data?.map((item) => ({
          ...item,
          paymentActual: roundIfDefined(item.paymentActual),
          paidOfDebt: roundIfDefined(item.paidOfDebt),
          paymentBeforeDebt: roundIfDefined(item.paymentBeforeDebt),
          benefit: roundIfDefined(item.benefit),
          reductionIncome: roundIfDefined(item.reductionIncome),
          reductionAssets: roundIfDefined(item.reductionAssets),
          reductionHousingCost: roundIfDefined(item.reductionHousingCost),
          totalIncome: roundIfDefined(item.totalIncome),
          remainDebt: roundIfDefined(item.remainDebt),
          paymentOrigin: roundIfDefined(item.paymentOrigin),
          calculationType: item.calculationType
            ? (item.calculationType as CalculationTypes)
            : undefined,
          transactionType: item.transactionType
            ? (item.transactionType as TransactionTypes)
            : undefined,
          nationalId: item.kennitala ?? undefined,
        })) ?? [],
    }
  }
}
