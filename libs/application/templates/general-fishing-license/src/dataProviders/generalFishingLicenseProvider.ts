import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { FishingLicenseShip } from '@island.is/api/schema'
import { queryShips } from '../graphql/queries'
import { error } from '../lib/messages'
interface GeneralFishingLicenseProps {
  ships: FishingLicenseShip[]
}

export class GeneralFishingLicenseProvider extends BasicDataProvider {
  type = 'GeneralFishingLicenseProvider'

  async queryShips(): Promise<FishingLicenseShip[]> {
    return this.useGraphqlGateway(queryShips)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        return Promise.resolve(response.data.fishingLicenseShips)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(): Promise<GeneralFishingLicenseProps> {
    const ships = await this.queryShips()
    if (!ships || ships.length <= 0) {
      return Promise.reject({
        reason: error.noShipsFoundError,
      })
    }

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

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  handleError(error: Error | unknown) {
    console.error(error)
    return Promise.reject('Failed to fetch data')
  }
}
