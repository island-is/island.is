import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { InsuranceCompany } from '@island.is/api/schema'
import { GET_INSURANCE_COMPANIES } from '../graphql/queries'

export class InsuranceCompaniesProvider extends BasicDataProvider {
  type = 'InsuranceCompaniesProvider'

  async provide(): Promise<InsuranceCompany[]> {
    return this.useGraphqlGateway(GET_INSURANCE_COMPANIES).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(
          response.data.transportAuthorityInsuranceCompanies,
        )
      },
    )
  }

  handleError(error: Error) {
    console.error(error)
    return Promise.reject({ reason: 'Failed to fetch data' })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(result: InsuranceCompany[]): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: result,
      status: 'success',
    }
  }
}
