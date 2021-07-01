import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import {
  Conditions,
  ConditionsResponse,
  DebtSchedules,
  DebtSchedulesResponse,
  Employer,
  PaymentScheduleServiceOptions,
  PAYMENT_SCHEDULE_OPTIONS,
  WageDeductionResponse,
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

  async getConditions(nationalId: string): Promise<Conditions> {
    const response = await this.get<ConditionsResponse>(
      `conditions/${nationalId}`,
    )

    return response.conditions
  }

  async getDebts(nationalId: string): Promise<DebtSchedules[]> {
    const response = await this.get<DebtSchedulesResponse>(
      `debtsandschedules/${nationalId}`,
    )
    console.log(response)
    return response.deptAndSchedules
  }

  async getCurrentEmployer(nationalId: string): Promise<Employer> {
    const response = await this.get<WageDeductionResponse>(
      `wagesdeduction/${nationalId}`,
    )
    return response.wagesDeduction
  }
}
