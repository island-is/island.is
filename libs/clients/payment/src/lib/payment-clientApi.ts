import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import type { ChargeResponse, Catalog, Charge } from './payment.type'
import { ConfigType } from '@nestjs/config'
import { PaymentClientModuleConfig } from './payment-client.config'

export class PaymentAPI extends RESTDataSource {
  constructor(
    @Inject(PaymentClientModuleConfig.KEY)
    private config: ConfigType<typeof PaymentClientModuleConfig>,
  ) {
    super()
    const { xRoadBaseUrl, xRoadProviderId } = this.config
    this.baseURL = `${xRoadBaseUrl}/r1/${xRoadProviderId}/chargeFJS/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-Road-Client', this.config.xRoadClientId)
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.config.username}:${this.config.password}`,
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
