import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  ProviderErrorReason,
} from '@island.is/application/types'
import { info } from 'kennitala'
import { m } from '../lib/messages'
import { MessageDescriptor } from '@formatjs/intl'
import { YES } from '../lib/constants'
import { getValueViaPath } from '@island.is/application/core'
import { DataProviderSuccess, OperatingLicenseFakeData } from '../types'

export class CriminalRecordProvider extends BasicDataProvider {
  type = 'CriminalRecordProvider'

  async provide(application: Application): Promise<DataProviderSuccess> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.criminalRecord === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: m.dataCollectionCriminalRecordErrorTitle,
              summary: m.dataCollectionNonBankruptcyDisclosureErrorSubtitle,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }

    const query = `
    query CriminalRecordValidation {
        criminalRecordValidation
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

      if (response.data.criminalRecordValidation !== true) {
        return Promise.reject({
          reason: {
            title: m.dataCollectionCriminalRecordErrorTitle,
            summary: m.dataCollectionNonBankruptcyDisclosureErrorSubtitle,
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
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
