import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import type {
  ChargeResponse,
  Catalog,
  PaymentServiceOptions,
  Charge,
} from './payment.type'
import { PAYMENT_OPTIONS } from './payment.type'

export class PaymentAPI extends RESTDataSource {
  constructor(
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
  ) {
    super()
    const { xRoadBaseUrl, xRoadProviderId } = this.options
    this.baseURL = `${xRoadBaseUrl}/r1/${xRoadProviderId}/chargeFJS/`
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
    return this.post<ChargeResponse>(`charge`, upcomingPayment)
  }

  getCatalog() {
    return this.get<Catalog>(`catalog`)
  }

  getCatalogByPerformingOrg(performingOrganizationID: string) {
    console.log(this.options)
    return this.get<Catalog>(
      `catalog/performingOrg/${performingOrganizationID}`,
    )
  }
}
