import { PaymentScheduleConditions } from '@island.is/api/schema'
import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class PaymentPlanPrerequisitesProvider extends BasicDataProvider {
  type = 'PaymentPlanPrerequisitesProvider'
  provide(): Promise<PaymentScheduleConditions> {
    const query = `
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

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      if (!res.ok) {
        console.error('failed http request', { res })
        return Promise.reject({ reason: 'Náði ekki sambandi við vefþjónustu' })
      }

      const response = await res.json()

      if (response.errors) {
        console.error('response errors', { response })
        return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
      }

      const responseObj = response.data.paymentScheduleConditions

      if (!responseObj) {
        console.error('response errors', { responseObj })
        return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
      }

      return Promise.resolve(responseObj)
    })
  }

  onProvideSuccess(
    prerequisites: PaymentScheduleConditions,
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
}
