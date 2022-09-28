import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { Application } from '@island.is/application/types'

export class CemetryLimitProvider extends BasicDataProvider {
  type = 'CemetryLimitProvider'

  async provide(application: Application): Promise<any> {
    const { answers, externalData } = application
    console.log({ answers, externalData })
    const query = `
      query FinancialStatementsInaoClientFinancialLimit(
        $input: InaoClientFinancialLimitInput!
      ) {
        financialStatementsInaoClientFinancialLimit(input: $input)
      }
    `

    // return this.useGraphqlGateway(query)
    //   .then(async (res: Response) => {
    //     const response = await res.json()
    //     if (response.errors?.length > 0) {
    //       return this.handleError(response.errors[0])
    //     }
    //     return Promise.resolve(
    //       response.data.financialStatementsInaoCurrentUserClientType,
    //     )
    //   })
    //   .catch((error) => this.handleError(error))
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
