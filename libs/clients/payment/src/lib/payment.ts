import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import { ChargeResponse, Charge, Catalog, PaymentServiceOptions } from './payment.type'

export const PAYMENT_OPTIONS = 'PAYMENT_OPTIONS'

export class PaymentService extends RESTDataSource {
  constructor(
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
  ) {
    super()
    this.baseURL = `https://tbrws-s.hysing.is/chargeFJS/v1`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      // `Basic ${Base64.encode(
      //   `${this.options.username}:${this.options.password}`,
      // )}`,
      `Basic ${Base64.encode(
        'isl_aranja_p:vogur.123'
      )}`,
    )
  }

  createCharge (
    upcomingPayment: Charge// CHARGE OBJECT,
  ): Promise<ChargeResponse> {
    return this.post<ChargeResponse>(
      `/charge`,
      upcomingPayment
    ) 
  }

  // could skip promise due to higher lvl graphql promise
  getCatalog() {
    return this.get<Catalog>(
      `/catalog`
    )
  }

  getCatalogByPerformingOrg(
      performingOrgID: string) {
        return this.get<Catalog>(
        `/catalog/performingOrg/${performingOrgID}`
      )
  }
}