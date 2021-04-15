import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  ApplicationTypes,
} from '@island.is/application/core'
import { Applications } from './APIDataTypes'

export class ApplicationsProvider extends BasicDataProvider {
  type = 'ApplicationsProvider'

  provide(): Promise<Applications[]> {
    const query = `query ApplicationApplications {
      applicationApplications(input: { typeId: ["${ApplicationTypes.HEALTH_INSURANCE}"] }, locale: "is") {
        id
        state
        created
      }
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data?.applicationApplications)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  handleError(error: any) {
    console.log('Provider error - Applications', error)
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
