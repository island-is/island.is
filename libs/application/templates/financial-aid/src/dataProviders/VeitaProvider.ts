import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { DataProviderTypes, Applicant } from '../lib/types'

export class VeitaProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry
  async provide(): Promise<string | undefined> {
    // TODO: We probably need application system id and current Veita id here
    const query = `
        query HasUserAppliedForPeriod {
            hasUserFinancialAidApplicationForCurrentPeriod {
                currentApplicationId
            }
        }
      `

    return this.useGraphqlGateway<string | undefined>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        const returnObject: string | undefined =
          response.data.currentUser?.currentApplicationId
        return Promise.resolve(returnObject)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }
  handleError(error: Error | unknown) {
    console.error('Provider.FinancialAid.VeitaProvider:', error)
    return Promise.reject('Failed to fetch from national registry')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: Applicant): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
