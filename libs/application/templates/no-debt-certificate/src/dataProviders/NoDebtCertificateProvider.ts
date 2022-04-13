import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { info } from 'kennitala'
import { m } from '../lib/messages'
import { MessageDescriptor } from '@formatjs/intl'

export class NoDebtCertificateProvider extends BasicDataProvider {
  type = 'NoDebtCertificateProvider'

  async provide(application: Application): Promise<unknown> {
    const query = `
    query NoDebtCertificateValidation {
        noDebtCertificateValidation
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

      if (response.data.noDebtCertificateValidation !== true) {
        return Promise.reject({})
      }

      return Promise.resolve({ isValid: true })
    })
  }

  onProvideError(errorMessage: MessageDescriptor): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: errorMessage?.id
        ? errorMessage
        : m.errorDataProviderNoDebtCertificate,
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
