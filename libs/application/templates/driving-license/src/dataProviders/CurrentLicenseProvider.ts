import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { DrivingLicenseFakeData, YES } from '../lib/constants'
import { Eligibility } from '../types/schema'

export class CurrentLicenseProvider extends BasicDataProvider {
  type = 'CurrentLicenseProvider'

  async provide(application: Application): Promise<{ currentLicense: Eligibility['id']|null }> {
    const fakeData = application.answers.fakeData as
      | DrivingLicenseFakeData
      | undefined

    if (fakeData?.useFakeData === YES) {
      return {
        currentLicense: fakeData.currentLicense === 'temp' ? 'B' : null,
      }
    }

    const query = `
      query LicenseQuery {
        drivingLicense {
          eligibilities {
            id
          }
        }
      }
    `

    const res = await this.useGraphqlGateway(query)

    if (!res.ok) {
      console.error('[CurrentLicenseProvider]', await res.json())

      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }

    const response = await res.json()

    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }

    const [ currentLicense ] = response.data.drivingLicense.eligibilities

    return {
      currentLicense: currentLicense || null,
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
