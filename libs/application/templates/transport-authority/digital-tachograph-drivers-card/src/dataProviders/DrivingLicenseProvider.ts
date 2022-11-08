import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { DrivingLicense } from '../types/schema'
import { GET_DRIVING_LICENSE } from '../graphql/queries'
import * as Sentry from '@sentry/react'
import { m } from '../lib/messagesx'

export class DrivingLicenseProvider extends BasicDataProvider {
  type = 'DrivingLicenseProvider'

  async provide(): Promise<DrivingLicense | null> {
    return this.useGraphqlGateway(GET_DRIVING_LICENSE).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        const data = response.data as {
          drivingLicense: DrivingLicense | null
        }
        const drivingLicenseData = data?.drivingLicense

        // Validate that user has the necessary categories
        const licenseCategories = drivingLicenseData?.categories?.map(
          (x) => x.name,
        )
        const validCategories = ['C', 'C1', 'D', 'D1']
        if (
          !licenseCategories ||
          !licenseCategories.some((x) => validCategories.includes(x))
        ) {
          return Promise.reject({
            reason: m.drivingLicenseProviderErrorMissing.defaultMessage,
          })
        }

        return Promise.resolve(drivingLicenseData)
      },
    )
    // .catch((error) => {
    //   return Promise.reject(error)
    // })
  }

  handleError(error: Error) {
    Sentry.captureException(error)
    return Promise.reject({ reason: 'Failed to fetch data' })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(result: string[]): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
