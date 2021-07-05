import { PaymentScheduleDebts } from '@island.is/api/schema'
import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class PaymentScheduleDebtsProvider extends BasicDataProvider {
  type = 'PaymentScheduleDebtsProvider'
  provide(): Promise<PaymentScheduleDebts[]> {
    const query = `
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

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      if (!res.ok) {
        console.error('failed http request', { res })
        return Promise.reject({ reason: 'Náði ekki sambandi við vefþjónustu' })
      }

      const response = await res.json()

      if (response.error) {
        console.error('response errors', { response })
        return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
      }

      const responseObj = response.data.paymentScheduleDebts

      if (!responseObj) {
        console.error('response errors', { responseObj })
        return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
      }

      return Promise.resolve(responseObj)
    })
  }

  onProvideSuccess(
    debts: PaymentScheduleDebts[],
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: debts,
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
