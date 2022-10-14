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

        const licenseCategories = data?.drivingLicense?.categories?.map(
          (x) => x.name,
        )

        // Validate that user has the necessary categories
        const validCategories = ['C', 'C1', 'D', 'D1', 'B'] //TODOx remove B
        if (
          !licenseCategories ||
          !licenseCategories.some((x) => validCategories.includes(x))
        ) {
          return Promise.reject({
            reason: m.drivingLicenseProviderErrorMissing.defaultMessage,
          })
        }

        return Promise.resolve(data?.drivingLicense)
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
