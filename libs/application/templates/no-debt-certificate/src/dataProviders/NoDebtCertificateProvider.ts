import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export class NoDebtCertificateProvider extends BasicDataProvider {
  type = 'NoDebtCertificateProvider'

  async provide(): Promise<unknown> {
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

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      if (response.data.getDebtLessCertificate.error) {
        console.error(
          `graphql error in ${this.type}: ${response.data.getDebtLessCertificate.error}`,
        )
        return Promise.reject({})
      }

      if (
        !response.data.getDebtLessCertificate.debtLessCertificateResult.debtLess
      ) {
        return Promise.reject({
          reason: m.missingCertificate,
        })
      }

      return Promise.resolve({
        certificate:
          response.data.getDebtLessCertificate.debtLessCertificateResult
            .certificate.document,
      })
    })
  }

  onProvideError(error?: { reason?: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: error?.reason ?? m.errorDataProvider,
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
