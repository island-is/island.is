import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { RegisteredChildren } from './APIDataTypes'

/** This is a temporary mock provider for children domicile transfer. National registry team are setting up real provider which we will connect to once it is up. **/
export class ChildrenNationalRegistryProvider extends BasicDataProvider {
  readonly type = 'ChildrenNationalRegistry'

  async provide(): Promise<RegisteredChildren> {
    const query = `query GetNationalRegistry {
        registeredChildren {[
            id
            name
            address
            postalCode
            city
        ]}
      }`
    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }
        return Promise.resolve(response.data.getNationalRegistry)
      })
      .catch(() => {
        return this.handleError()
      })
  }
  handleError() {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve([
        {
          id: '1',
          name: 'Ólafur Helgi Eiríksson',
          address: 'Vesturgata 22',
          postalCode: '101',
          city: 'Reykjavík',
        },
        {
          id: '2',
          name: 'Rósa Líf Eiríksdóttir',
          address: 'Vesturgata 22',
          postalCode: '101',
          city: 'Reykjavík',
        },
      ])
    }
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
  onProvideSuccess(result: RegisteredChildren): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
