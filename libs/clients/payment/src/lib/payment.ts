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
    const { XROAD_BASE_URL, XROAD_PROVIDER_ID } = this.options
    this.baseURL = `${XROAD_BASE_URL}/r1/${XROAD_PROVIDER_ID}/catalog/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-Road-Client', this.options.XROAD_CLIENT_ID)
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.PAYMENT_USERNAME}:${this.options.PAYMENT_PASSWORD}`,
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
    return this.get<Catalog>(
      `catalog/performingOrg/${performingOrganizationID}`,
    )
  }
}
