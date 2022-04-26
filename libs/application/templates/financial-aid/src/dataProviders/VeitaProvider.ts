import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { CurrentApplication, DataProviderTypes } from '../lib/types'

export class VeitaProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry
  async provide(): Promise<CurrentApplication> {
    // TODO: We probably need application system id and current Veita id here
    const query = `
        query MunicipalitiesFinancialAidCurrentApplicationQuery {
          municipalitiesFinancialAidCurrentApplication
        }
      `

    return this.useGraphqlGateway<CurrentApplication>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        const returnObject =
          response.data.municipalitiesFinancialAidCurrentApplication

        return Promise.resolve({ currentApplicationId: returnObject })
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }
  handleError(error: Error | unknown) {
    console.error('Provider.FinancialAid.VeitaProvider:', error)
    return Promise.reject('Failed to fetch data from Veita')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: CurrentApplication): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
