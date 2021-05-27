import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { DrivingLicenseType } from '../types/schema'

export class EntitlementTypesProvider extends BasicDataProvider {
  type = 'EntitlementTypesProvider'

  async provide(application: Application): Promise<DrivingLicenseType> {
    const query = `
      query DrivingLicenseEntitlementTypes {
        drivingLicenseEntitlementTypes {
          id
          name
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }

        return Promise.resolve(response.data.drivingLicenseEntitlementTypes)
      })
      .catch(() => {
        return this.handleError()
      })
  }

  handleError() {
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
