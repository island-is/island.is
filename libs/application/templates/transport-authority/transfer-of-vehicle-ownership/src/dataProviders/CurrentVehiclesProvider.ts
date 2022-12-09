import {
  BasicDataProvider,
  Application,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { GET_CURRENT_VEHICLES } from '../graphql/queries'
import { error as errorMsg, externalData } from '../lib/messages'
import { MessageDescriptor } from '@formatjs/intl'
import { info } from 'kennitala'

export class CurrentVehiclesProvider extends BasicDataProvider {
  type = 'CurrentVehiclesProvider'

  async provide(application: Application): Promise<VehiclesCurrentVehicle[]> {
    const applicantSsn = application.applicant

    const errorMessage = this.validateApplicant(applicantSsn)
    if (errorMessage) {
      return Promise.reject({ reason: errorMessage })
    }

    return this.useGraphqlGateway(GET_CURRENT_VEHICLES, {
      input: {
        showOwned: true,
        showCoowned: false,
        showOperated: false,
      },
    }).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return this.handleError(response.errors)
      }

      const result = response.data.currentVehicles

      // Validate that user has at least 1 vehicle he can transfer
      if (!result || !result.length) {
        return Promise.reject({
          reason: externalData.currentVehicles.empty,
        })
      }

      return Promise.resolve(result)
    })
  }

  validateApplicant(ssn: string): MessageDescriptor | null {
    // Validate applicants age
    const minAge = 18
    const { age } = info(ssn)
    if (age < minAge) {
      return errorMsg.minAgeNotFulfilled
    }

    return null
  }

  handleError(error: Error) {
    console.error(error)
    return Promise.reject({ reason: errorMsg.failedToFetchData })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(
    result: VehiclesCurrentVehicle[],
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: result,
      status: 'success',
    }
  }
}
