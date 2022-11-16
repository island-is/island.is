import { getValueViaPath, YES } from '@island.is/application/core'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  ProviderErrorReason,
  Application,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { DataProviderSuccess, OperatingLicenseFakeData } from '../types'
import { DebtLessCertificateModel } from '../types/schema'
export class NoDebtCertificateProvider extends BasicDataProvider {
  type = 'NoDebtCertificateProvider'

  async provide(application: Application): Promise<DataProviderSuccess> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.debtStatus === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: m.missingCertificateTitle,
              summary: m.missingCertificateSummary,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }

    const query = `
    query GetDebtLessCertificate($input: String!) {
        getDebtLessCertificate(input: $input) {
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

    return this.useGraphqlGateway(query, {
      input: this.config.locale === 'is' ? 'IS' : 'EN',
    }).then(async (res: Response) => {
      const response = await res.json()
      if (response.errors) {
        return Promise.reject({})
      }

      if (response.data.getDebtLessCertificate.error) {
        return Promise.reject({})
      }

      if (
        !response.data.getDebtLessCertificate.debtLessCertificateResult.debtLess
      ) {
        return Promise.reject({
          reason: {
            title: m.missingCertificateTitle,
            summary: m.missingCertificateSummary,
            hideSubmitError: true,
          },
          statusCode: 404,
        })
      }

      return Promise.resolve({ success: true })
    })
  }

  onProvideError(error: {
    reason: ProviderErrorReason
    statusCode?: number
  }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error?.reason ?? m.errorDataProvider,
      hideSubmitError: error?.reason?.hideSubmitError,
      status: 'failure',
      statusCode: error.statusCode,
    }
  }

  onProvideSuccess(
    result: Record<string, DebtLessCertificateModel>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
