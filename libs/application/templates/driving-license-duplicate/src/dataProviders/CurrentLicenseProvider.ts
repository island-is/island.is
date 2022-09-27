import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { Eligibility, DrivingLicense } from '@island.is/api/schema'

export interface CurrentLicenseProviderResult {
  categories: Eligibility[] | null
  expires: Date
}
export class CurrentLicenseProvider extends BasicDataProvider {
  type = 'CurrentLicenseProvider'

  async provide(): Promise<CurrentLicenseProviderResult> {
    const query = `
      query LicenseQuery {
        drivingLicense {
          issued
          expires
          categories {
            name
            expires
          }
        }
      }
    `

    const res = await this.useGraphqlGateway<{
      drivingLicense: DrivingLicense | null
    }>(query)

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
    const categories = (response.data?.drivingLicense?.categories ?? []).map(
      (category: Eligibility) => ({
        ...category,
        name:
          category.name === 'B'
            ? response.data?.drivingLicense?.issued === category.issued
              ? 'B'
              : 'B-full'
            : category.name,
      }),
    )
    return {
      categories: categories ? categories : null,
      expires: response.data?.drivingLicense?.expires,
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(
    result: CurrentLicenseProviderResult,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
