import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { ParentResidenceChange } from '@island.is/application/templates/children-residence-change'

/** This is a temporary mock provider for children residence change. National registry team are setting up real provider which we will connect to once it is up. **/
export class ParentNationalRegistryProvider extends BasicDataProvider {
  readonly type = 'ParentNationalRegistry'

  async provide(): Promise<ParentResidenceChange> {
    const query = `query GetNationalRegistry {
        parent {[
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
    return Promise.resolve({
      id: '1',
      name: 'Eiríkur Jónsson',
      ssn: '120486-7899',
      address: 'Suðurgata 35, íbúð 2',
      postalCode: '105',
      city: 'Reykjavík',
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
  onProvideSuccess(result: ParentResidenceChange): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
