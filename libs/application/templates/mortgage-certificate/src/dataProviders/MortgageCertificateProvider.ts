import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { info } from 'kennitala'
import { m } from '../lib/messages'
import { MessageDescriptor } from '@formatjs/intl'

export class MortgageCertificateProvider extends BasicDataProvider {
  type = 'MortgageCertificateProvider'

  async provide(application: Application): Promise<unknown> {
    //TODOx
    /*const query = `
    query MortgageCertificateValidation {
        mortgageCertificateValidation
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      if (response.data.mortgageCertificateValidation !== true) {
        return Promise.reject({})
      }

      return Promise.resolve({ isValid: true })
    })*/

    return Promise.resolve()
  }

  onProvideError({ reason }: { reason: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: reason,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
