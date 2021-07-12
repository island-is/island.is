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

const queryPaymentScheduleDebts = `
  query PaymentScheduleDebts {
    paymentScheduleDebts {
      nationalId
      type
      paymentSchedule
      organization
      explanation
      totalAmount
      chargetypes {
        id
        name
        principal
        intrest
        expenses
        total
      }
    }
  }		
`

const queryPaymentScheduleConditions = `
  query PaymentScheduleConditions {
      paymentScheduleConditions {
        nationalId
        maxDebtAmount
        maxDebtAmount
        totalDebtAmount
        minPayment
        maxPayment
        collectionActions
        doNotOwe
        maxDebt
        oweTaxes
        disposableIncome
        taxReturns
        vatReturns
        citReturns
        accommodationTaxReturns
        withholdingTaxReturns
        wageReturns
        alimony
    }
  }
`

const queryPaymentScheduleEmployer = `
  query PaymentScheduleEmployer {
    paymentScheduleEmployer {
      nationalId    
      name
    }
  }
`

const queryPaymentScheduleInitialSchedule = `
  query PaymentScheduleInitialSchedule($input: GetInitialScheduleInput!) {
    paymentScheduleInitialSchedule (input : $input){
      nationalId
      scheduleType
      minPayment
      maxPayment
      minCountMonth
      maxCountMonth
    }
  }
`

interface PaymentPlanPrerequisitesProps {
  conditions: PaymentScheduleConditions
  debts: PaymentScheduleDebts[]
  allInitialSchedules: PaymentScheduleInitialSchedule[]
  employer: PaymentScheduleEmployer
}

export class PaymentPlanPrerequisitesProvider extends BasicDataProvider {
  type = 'PaymentPlanPrerequisitesProvider'

  async queryPaymentScheduleDebts(): Promise<PaymentScheduleDebts[]> {
    return this.useGraphqlGateway(queryPaymentScheduleDebts).then(
      async (res: Response) => {
        if (!res.ok) {
          return this.handleError(res, 'Could not connect to web service')
        }

        const response = await res.json()

        if (response.error) {
          return this.handleError(response)
        }

        const responseObj = response.data.paymentScheduleDebts

        if (!responseObj) {
          return this.handleError(responseObj)
        }

        return Promise.resolve(responseObj)
      },
    )
  }

  async queryPaymentScheduleConditions(): Promise<PaymentScheduleConditions> {
    return this.useGraphqlGateway(queryPaymentScheduleConditions).then(
      async (res: Response) => {
        if (!res.ok) {
          return this.handleError(res, 'Could not connect to web service')
        }

        const response = await res.json()

        if (response.error) {
          return this.handleError(response)
        }

        const responseObj = response.data.paymentScheduleConditions

        if (!responseObj) {
          return this.handleError(responseObj)
        }

        return Promise.resolve(responseObj)
      },
    )
  }

  async queryPaymentScheduleEmployer(): Promise<PaymentScheduleEmployer> {
    return this.useGraphqlGateway(queryPaymentScheduleEmployer).then(
      async (res: Response) => {
        if (!res.ok) {
          return this.handleError(res, 'Could not connect to web service')
        }

        const response = await res.json()

        if (response.error) {
          return this.handleError(response)
        }

        const responseObj = response.data.paymentScheduleEmployer

        if (!responseObj) {
          return this.handleError(responseObj)
        }

        return Promise.resolve(responseObj)
      },
    )
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
    }).then(async (res: Response) => {
      if (!res.ok) {
        return this.handleError(res, 'Could not connect to web service')
      }

      const response = await res.json()

      if (response.error) {
        return this.handleError(response)
      }

      const responseObj = response.data.paymentScheduleInitialSchedule

      if (!responseObj) {
        return this.handleError(responseObj)
      }

      return Promise.resolve(responseObj)
    })
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

  handleError(error: Error | unknown, reason?: string) {
    console.error('response errors', error)
    return Promise.reject({ reason: reason || 'Failed to fetch data' })
  }
}
