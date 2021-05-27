import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PenaltyPointStatus } from '../types/schema'

export class PenaltyPointsProvider extends BasicDataProvider {
  type = 'PenaltyPointsProvider'

  async provide(application: Application): Promise<PenaltyPointStatus> {
    const query = `
      query DrivingLicensePenaltyPointStatus {
        drivingLicensePenaltyPointStatus {
          nationalId
          isPenaltyPointsOk
        }
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()
      if (response.errors) {
        return this.handleError()
      }

      const penaltyPointsStatus = response.data.drivingLicensePenaltyPointStatus
      if (penaltyPointsStatus.isPenaltyPointsOk) {
        return Promise.resolve(penaltyPointsStatus)
      } else {
        return Promise.reject(penaltyPointsStatus)
      }
    })
  }

  handleError() {
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason:
        'Punktastaða er ekki í lagi, hafðu samband við Sýslumenn fyrir frekari upplýsingar',
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
