import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import {
  ConditionsResponse,
  PaymentScheduleServiceOptions,
  PAYMENT_SCHEDULE_OPTIONS,
} from './payment-schedule.type'

export class PaymentScheduleAPI extends RESTDataSource {
  constructor(
    @Inject(PAYMENT_SCHEDULE_OPTIONS)
    private readonly options: PaymentScheduleServiceOptions,
  ) {
    super()
    const { xRoadBaseUrl, xRoadProviderId } = this.options
    this.baseURL = `${xRoadBaseUrl}/r1/${xRoadProviderId}/paymentSchedule_v1/`
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

  async getConditions(nationalId: string): Promise<ConditionsResponse> {
    const response = await this.get<ConditionsResponse>(
      `conditions/${nationalId}`,
    )
    console.log(response)
    return response
  }
}
