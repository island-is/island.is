import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class HealthInsuranceProvider extends BasicDataProvider {
  type = 'HealthInsuranceProvider'

  provide(application: Application): Promise<string> {
    const query = `query HealthInsuranceIsHealthInsured {
      healthInsuranceIsHealthInsured 
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError('An error occured. Please try again.')
        }

        return Promise.resolve(response.data?.healthInsuranceIsHealthInsured)
      })
      .catch(() => {
        return this.handleError('An error occured. Please try again.')
      })
  }

  handleError(message: string) {
    return Promise.reject(message)
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
