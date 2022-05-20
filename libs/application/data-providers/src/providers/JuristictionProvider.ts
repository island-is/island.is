import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class JuristictionProvider extends BasicDataProvider {
  type = 'JuristictionProvider'

  async provide(_: Application) {
    const query = `
      query DrivingLicenseEntitlementTypes {
        drivingLicenseListOfJuristictions {
          id
          name
          zip
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError()
        }

        return Promise.resolve(response.data.drivingLicenseListOfJuristictions)
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
