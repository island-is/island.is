import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
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
        : Promise.reject({})
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
        return Promise.reject({})
      }

      return Promise.resolve({ success: true })
    })
  }

  onProvideError(errorMessage: MessageDescriptor): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: errorMessage?.id ? errorMessage : m.errorDataProvider,
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
