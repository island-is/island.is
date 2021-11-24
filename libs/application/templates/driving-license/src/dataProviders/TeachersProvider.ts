import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  coreErrorMessages,
} from '@island.is/application/core'
import { Teacher } from '@island.is/api/schema'

export class TeachersProvider extends BasicDataProvider {
  type = 'TeachersProvider'

  async provide(): Promise<Teacher[]> {
    const query = `
      query DrivingLicenseTeachers {
        drivingLicenseTeachers {
          name
        }
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      return Promise.resolve(response.data.drivingLicenseTeachers)
    })
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: coreErrorMessages.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
