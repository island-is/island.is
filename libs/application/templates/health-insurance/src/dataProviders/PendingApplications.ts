import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class PendingApplications extends BasicDataProvider {
  type = 'PendingApplications'

  provide(application: Application): Promise<string> {
    const query = `query HealthInsuranceGetPendingApplication {
      healthInsuranceGetPendingApplication 
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors[0].message)
        }

        return Promise.resolve(
          response.data?.healthInsuranceGetPendingApplication,
        )
      })
      .catch(() => {
        return this.handleError('An error occured. Please try again.')
      })
  }

  handleError(error: any) {
    return Promise.resolve(error ? error : 'error')
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
