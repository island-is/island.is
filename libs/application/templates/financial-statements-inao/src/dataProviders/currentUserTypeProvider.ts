import { FinancialStatementsInaoClientType } from '@island.is/api/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
export class CurrentUserTypeProvider extends BasicDataProvider {
  type = 'CurrentUserTypeProvider'

  async provide(): Promise<FinancialStatementsInaoClientType> {
    const query = `
      query FinancialStatementsInaoClientType {
        financialStatementsInaoCurrentUserClientType {
          value
          label
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }
        return Promise.resolve(
          response.data.financialStatementsInaoCurrentUserClientType,
        )
      })
      .catch((error) => this.handleError(error))
  }

  handleError(error: any) {
    console.log('Provider error - ElectionTypesProvider:', error)
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

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
