import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FishingLicenseShip } from '@island.is/api/schema'
import * as Sentry from '@sentry/react'
import { queryShips } from '../graphql/queries'
import { error } from '../lib/messages'
import { Inject, Injectable, Logger } from '@nestjs/common'
interface GeneralFishingLicenseProps {
  ships: FishingLicenseShip[]
}

@Injectable()
export class GeneralFishingLicenseProvider extends BasicDataProvider {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()
  }

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
    this.logger.debug(`Looking up ships owned by the applicant`)
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
    const returnedError = {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
    this.logger.error(returnedError)
    return returnedError
  }

  handleError(error: Error | unknown) {
    Sentry.captureException(error)
    return Promise.reject('Failed to fetch data')
  }
}
