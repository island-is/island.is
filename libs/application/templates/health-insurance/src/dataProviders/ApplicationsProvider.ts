import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  ApplicationTypes,
} from '@island.is/application/core'

export class ApplicationsProvider extends BasicDataProvider {
  type = 'ApplicationsProvider'

  provide(application: Application): Promise<string> {
    const query = `query GetApplicantApplications {
      getApplicationsByApplicant(typeId: ${ApplicationTypes.HEALTH_INSURANCE}) {
        id
        state
        created
      }
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response)
        }

        return Promise.resolve(response.data?.getApplicationsByApplicant)
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
