import { Inject } from '@nestjs/common'
import {
  RESTDataSource,
  RequestOptions,
} from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import {
  ChargeResponse,
  Charge,
  Catalog,
  PaymentServiceOptions,
  PAYMENT_OPTIONS
} from './payment.type'

export class PaymentAPI extends RESTDataSource {
  constructor(
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
  ) {
    super()

    this.baseURL = `${this.options.xRoadPath}/GOV/10021/FJS-DEV-Public/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-Road-Client', this.options.xRoadClientId)
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    return this.post<ChargeResponse>(`catalog/charge`, upcomingPayment)
  }

  getCatalog() {
    const response = this.get<Catalog>(`catalog/catalog`)
    return response
  }

  getCatalogByPerformingOrg(performingOrganizationID: string) {
    const response = this.get<Catalog>(
      `catalog/catalog/performingOrg/${performingOrganizationID}`,
    )
    return response
  }
}
