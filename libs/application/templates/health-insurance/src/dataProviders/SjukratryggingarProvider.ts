import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class SjukratryggingarProvider extends BasicDataProvider {
  type = 'SjukratryggingarProvider'

  provide(application: Application): Promise<string> {
    const query = `query HealthInsuranceIsHealthInsured {
      healthInsuranceIsHealthInsured(nationalId: "2811638099") 
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return Promise.reject(response.errors)
        }

        return Promise.resolve(response.data?.healthInsuranceIsHealthInsured)
      })
      .catch((e) => {
        return Promise.reject(e)
      })
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
