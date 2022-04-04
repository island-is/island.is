import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  coreErrorMessages,
} from '@island.is/application/core'
import { SchoolTestResultType } from '@island.is/api/schema'

export class SchoolTypesProvider extends BasicDataProvider {
  type = 'SchoolTypeProvider'

  async provide(): Promise<SchoolTestResultType[]> {
    const query = `
    query drivingLicenseBookSchoolTypes {
      drivingLicenseBookSchoolTypes {
        schoolTypeId
        schoolTypeName
        schoolTypeCode
        licenseCategory
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

      return Promise.resolve(response.data.drivingLicenseBookSchoolTypes)
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
