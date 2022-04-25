import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { FishingLicenseShip } from '@island.is/api/schema'
import * as Sentry from '@sentry/react'
import { queryShips } from '../graphql/queries'

interface GeneralFishingLicenseProps {
  ships: FishingLicenseShip[]
}

export class GeneralFishingLicenseProvider extends BasicDataProvider {
  type = 'GeneralFishingLicenseProvider'

  async queryShips(): Promise<FishingLicenseShip[]> {
    return this.useGraphqlGateway(queryShips).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return this.handleError(response.errors)
      }

      return Promise.resolve(response.data.fishingLicenseShips)
    })
  }

  async provide(): Promise<GeneralFishingLicenseProps> {
    const ships = await this.queryShips()

    return {
      ships,
    }
  }

  onProvideSuccess(
    generalFishingLicense: GeneralFishingLicenseProps,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: generalFishingLicense,
      status: 'success',
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }

  handleError(error: Error | unknown) {
    Sentry.captureException(error)
    return Promise.reject('Failed to fetch data')
  }
}
