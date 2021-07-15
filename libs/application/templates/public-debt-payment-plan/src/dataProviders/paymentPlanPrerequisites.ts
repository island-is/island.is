import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from '@island.is/api/schema'
import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import {
  queryPaymentScheduleConditions,
  queryPaymentScheduleDebts,
  queryPaymentScheduleEmployer,
  queryPaymentScheduleInitialSchedule,
} from '../graphql/queries'

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

  async provide(): Promise<PaymentPlanPrerequisitesProps> {
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

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }

  handleError(error: Error | unknown) {
    console.error(`Error in Payment Plan Prerequisites Provider:`, error)

    return Promise.reject('Failed to fetch data')
  }
}
