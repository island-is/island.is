import { coreErrorMessages } from '@island.is/application/core'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { RskCompany } from '@island.is/api/schema'

export class CompanyRegistryProvider extends BasicDataProvider {
  type = 'CompanyRegistryProvider'

  async provide(_application: Application): Promise<RskCompany> {
    const query = `
      query CompanyRegistryQuery {
        companyRegistryCurrentCompany{
          nationalId,
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
      return Promise.resolve(response.data.companyRegistryCurrentCompany)
    })
  }

  onProvideError(_result: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: coreErrorMessages.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
