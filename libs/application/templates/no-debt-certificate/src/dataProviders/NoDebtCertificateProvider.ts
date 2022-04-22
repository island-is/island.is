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
    query GetDebtLessCertificate {
        getDebtLessCertificate {
          debtLessCertificateResult {
            debtLess
            certificate {
              type
              document
            }
          }
          error {
            code
            message
            errors {
              code
              message
              help
              trackingId
              param
            }
          }
        }
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      //TODOx skoða líka ef response.error... og er það er ekki skuldlaust... þá færðu ekkert vottorð

      if (response.errors) {
        console.log(JSON.stringify(response))
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      // if (!response.data.getDebtLessCertificate?.debtLessCertificateResult) {
      //   return Promise.reject({})
      // }

      // return Promise.resolve()

      return Promise.reject({})
    })
  }

  onProvideError(errorMessage: MessageDescriptor): FailedDataProviderResult {
    console.log('---------errorMessage: ' + JSON.stringify(errorMessage))
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
