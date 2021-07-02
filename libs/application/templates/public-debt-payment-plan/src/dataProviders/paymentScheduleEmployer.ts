import { PaymentScheduleEmployer } from '@island.is/api/schema'
import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class PaymentScheduleEmployerProvider extends BasicDataProvider {
  type = 'PaymentScheduleEmployerProvider'
  provide(): Promise<PaymentScheduleEmployer> {
    const query = `
      query PaymentScheduleEmployer {
        paymentScheduleEmployer {
          nationalId    
          name
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

      const responseObj = response.data.paymentScheduleEmployer

      if (!responseObj) {
        console.error('response errors', { responseObj })
        return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
      }

      return Promise.resolve(responseObj)
    })
  }

  onProvideSuccess(
    employer: PaymentScheduleEmployer,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: employer,
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
