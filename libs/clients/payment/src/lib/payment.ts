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
    this.baseURL = `https://tbrws-s.hysing.is` + `/chargeFJS/v1`
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
  async createCharge (
    upcomingPayment: Charge// CHARGE OBJECT,
  ): Promise<ChargeResponse> {
    const response = await this.post<ChargeResponse>(
      `/charge`,
      upcomingPayment
    ) 
    return response
  }

  async getCatalog(): Promise<Catalog> {
    const response = await this.get<Catalog>(
      `/catalog`
    )
    return response
  }

  async getCatalogByPerformingOrg(
      performingOrgID: string
    ): Promise<Catalog> {
    const response = await this.get<Catalog>(
      `/catalog/performingOrg/${performingOrgID}`
    )
    return response
  }

  /// Version 2!
  /// If parameter performingOrgID then fetch catalog for respective organization, else get all catalogs.
  async getCatalog2(performingOrgID?: string): Promise<Catalog> {
    let path = `/catalog`
    performingOrgID != undefined ? path = path + `/performingOrg/${performingOrgID}` : path
    const response = await this.get<Catalog>(
      path
    )
    return response
  }
}