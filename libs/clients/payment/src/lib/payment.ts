import { Inject } from '@nestjs/common'
import {
  RESTDataSource,
  RequestOptions,
  HTTPCache,
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
    this.baseURL = this.options.url
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    return this.post<ChargeResponse>(`/chargeFJS/v1/charge`, upcomingPayment)
  }

  getCatalog() {
    const response = this.get<Catalog>(`/chargeFJS/v1/catalog`)
    return response
  }

  async getCatalogByPerformingOrg(performingOrganizationID: string) {
    const response = await this.get<Catalog>(
      `/chargeFJS/v1/catalog/performingOrg/${performingOrganizationID}`,
    )
    return response
  }
}
