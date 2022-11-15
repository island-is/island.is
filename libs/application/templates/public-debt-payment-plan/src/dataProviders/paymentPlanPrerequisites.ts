import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  ProviderErrorReason,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import {
  queryPaymentScheduleConditions,
  queryPaymentScheduleDebts,
  queryPaymentScheduleEmployer,
  queryPaymentScheduleInitialSchedule,
} from '../graphql/queries'
import { errorModal } from '../lib/messages'
import { NO, YES } from '../shared/constants'
import { mockData } from './mockData'

interface PaymentPlanPrerequisitesProps {
  conditions: PaymentScheduleConditions
  debts: PaymentScheduleDebts[]
  allInitialSchedules: PaymentScheduleInitialSchedule[]
  employer: PaymentScheduleEmployer
}

export class PaymentPlanPrerequisitesProvider extends BasicDataProvider {
  type = 'PaymentPlanPrerequisitesProvider'

  async queryPaymentScheduleDebts(): Promise<PaymentScheduleDebts[]> {
    return this.useGraphqlGateway(queryPaymentScheduleDebts)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.paymentScheduleDebts)
      })
      .catch((error) => this.handleError(error))
  }

  async queryPaymentScheduleConditions(): Promise<PaymentScheduleConditions> {
    return this.useGraphqlGateway(queryPaymentScheduleConditions)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.paymentScheduleConditions)
      })
      .catch((error) => this.handleError(error))
  }

  async queryPaymentScheduleEmployer(): Promise<PaymentScheduleEmployer> {
    return this.useGraphqlGateway(queryPaymentScheduleEmployer)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.paymentScheduleEmployer)
      })
      .catch((error) => this.handleError(error))
  }

  async queryPaymentScheduleInitialSchedule(
    totalAmount: number,
    disposableIncome: number,
    type: string,
  ): Promise<PaymentScheduleInitialSchedule> {
    return this.useGraphqlGateway(queryPaymentScheduleInitialSchedule, {
      input: {
        totalAmount,
        disposableIncome,
        type,
      },
    })
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.paymentScheduleInitialSchedule)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(
    application: Application,
  ): Promise<PaymentPlanPrerequisitesProps> {
    const fakeData = getValueViaPath(application.answers, 'mock') as {
      useMockData: typeof YES | typeof NO
    }
    if (fakeData?.useMockData === YES) {
      return {
        conditions: mockData.data.conditions,
        debts: mockData.data.debts as PaymentScheduleDebts[],
        allInitialSchedules: mockData.data
          .allInitialSchedules as PaymentScheduleInitialSchedule[],
        employer: mockData.data.employer,
      }
    }
    const paymentScheduleConditions = await this.queryPaymentScheduleConditions()
    const paymentScheduleDebts = await this.queryPaymentScheduleDebts()
    const paymentScheduleEmployer = await this.queryPaymentScheduleEmployer()
    const allInitialSchedules = [] as PaymentScheduleInitialSchedule[]

    for (const debt of paymentScheduleDebts) {
      const initialSchedule = await this.queryPaymentScheduleInitialSchedule(
        debt.totalAmount,
        paymentScheduleConditions.disposableIncome,
        debt.type,
      )

      allInitialSchedules.push(initialSchedule)
    }

    // If no debts are found inform the applicant that they will not be able to apply for a payment plan
    if (
      paymentScheduleConditions.maxDebt ||
      !paymentScheduleConditions.taxReturns ||
      !paymentScheduleConditions.vatReturns ||
      !paymentScheduleConditions.citReturns ||
      !paymentScheduleConditions.accommodationTaxReturns ||
      !paymentScheduleConditions.withholdingTaxReturns ||
      !paymentScheduleConditions.wageReturns ||
      paymentScheduleConditions.collectionActions ||
      !paymentScheduleConditions.doNotOwe ||
      paymentScheduleDebts.length <= 0
    ) {
      return Promise.reject({
        reason: {
          title: errorModal.noDebts.title,
          summary: errorModal.noDebts.summary,
        },
        statusCode: 404,
      })
    }

    return {
      conditions: paymentScheduleConditions,
      debts: paymentScheduleDebts,
      allInitialSchedules: allInitialSchedules,
      employer: paymentScheduleEmployer,
    }
  }

  onProvideSuccess(
    prerequisites: PaymentPlanPrerequisitesProps,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: prerequisites,
      status: 'success',
    }
  }

  onProvideError(error: {
    reason: ProviderErrorReason
    statusCode?: number
  }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure',
      statusCode: error.statusCode,
    }
  }

  handleError(error: Error | unknown) {
    console.error(`Error in Payment Plan Prerequisites Provider:`, error)

    return Promise.reject('Failed to fetch data')
  }
}
