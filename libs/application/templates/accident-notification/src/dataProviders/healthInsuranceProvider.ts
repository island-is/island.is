import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import gql from 'graphql-tag'

export const HealthInsuranceQuery = gql`
  query HealthInsuranceIsHealthInsured($nationalId: String!, $date: number) {
    healthInsuranceIsHealthInsured(kennitala: $nationalId, date: $date) {
      radnumer_is
      sjukratryggdur
      dags
      a_bidtima
    }
  }
`

export class HealthInsuranceProvider extends BasicDataProvider {
  type = 'HealthInsuranceProvider'

  provide(application: Application): Promise<boolean> {
    const query = `query HealthInsuranceIsHealthInsured {
        healthInsuranceIsHealthInsured 
      }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data?.healthInsuranceIsHealthInsured)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  handleError(error: any) {
    console.log('Provider error - HealthInsurance:', error)
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
