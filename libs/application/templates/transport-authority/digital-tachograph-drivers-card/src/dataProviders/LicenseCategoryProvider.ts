import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { DrivingLicense } from '../types/schema'
import { GET_LICENSE_CATEGORIES } from '../graphql/queries'
import * as Sentry from '@sentry/react'
import { m } from '../lib/messages'

export class LicenseCategoryProvider extends BasicDataProvider {
  type = 'LicenseCategoryProvider'

  async provide(): Promise<string[] | undefined> {
    return this.useGraphqlGateway(GET_LICENSE_CATEGORIES).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        const data = response.data as {
          drivingLicense: DrivingLicense | null
        }

        const result = data?.drivingLicense?.categories?.map((x) => x.name)

        // Validate that user has the necessary categories
        const validCategories = ['C', 'C1', 'D', 'D1']
        if (!result || !result.some((x) => validCategories.includes(x))) {
          return Promise.reject({
            reason: m.licenseCategoryProviderErrorMissing.defaultMessage,
          })
        }

        return Promise.resolve(result)
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
