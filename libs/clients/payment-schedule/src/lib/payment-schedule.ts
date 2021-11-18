import { Inject } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { Base64 } from 'js-base64'
import { roundToUpperThousand } from './payment-schedule.utils'
import {
  Conditions,
  DebtSchedules,
  DebtSchedulesResponse,
  Employer,
  WageDeductionResponse,
  PaymentScheduleServiceOptions,
  PAYMENT_SCHEDULE_OPTIONS,
  DistributionInitialPosition,
  DistributionInitialPositionRequest,
  DistributionInitialPositionResponse,
  PaymentDistribution,
  PaymentDistributionRequest,
  PaymentDistributionResponse,
  ConditionsResponse,
} from './types'

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

    return response.deptAndSchedules
  }

  async getCurrentEmployer(nationalId: string): Promise<Employer> {
    const response = await this.get<WageDeductionResponse>(
      `wagesdeduction/${nationalId}`,
    )
    return response.wagesDeduction
  }

  async getInitalSchedule(
    request: DistributionInitialPositionRequest,
  ): Promise<DistributionInitialPosition> {
    const { nationalId, totalAmount, disposableIncome, type } = request
    const response = await this.get<DistributionInitialPositionResponse>(
      `distributionInitialPosition/${nationalId}/${type}?totalAmount=${totalAmount}&disposableIncome=${disposableIncome}`,
    )

    return {
      ...response.distributionInitialPosition,
      minPayment: response.distributionInitialPosition.minPayment,
    }
  }

  async getPaymentDistribtion(
    request: PaymentDistributionRequest,
  ): Promise<PaymentDistribution> {
    const {
      nationalId,
      totalAmount,
      scheduleType,
      monthAmount,
      monthCount,
    } = request

    const queryParams = new URLSearchParams()
    queryParams.append('totalAmount', totalAmount.toString())

    if (monthAmount) queryParams.append('monthAmount', monthAmount.toString())
    if (monthCount) queryParams.append('monthCount', monthCount.toString())

    const response = await this.get<PaymentDistributionResponse>(
      `paymentDistribution/${nationalId}/${scheduleType}`,
      queryParams.toString(),
    )
    return response.paymentDistribution
  }
}
