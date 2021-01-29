import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'

/** This is a temporary mock provider for children residence change. National registry team are setting up real provider which we will connect to once it is up. **/
export class ChildrenNationalRegistryProvider extends BasicDataProvider {
  readonly type = 'ChildrenNationalRegistry'

  async provide(): Promise<PersonResidenceChange> {
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
  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }
  onProvideSuccess(
    result: PersonResidenceChange,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
