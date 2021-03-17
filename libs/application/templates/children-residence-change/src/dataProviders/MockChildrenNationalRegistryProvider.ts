import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { CRCApplication } from '../types'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'

/** This is a temporary mock provider for children residence change. National registry team are setting up real provider which we will connect to once it is up. **/
export class MockChildrenNationalRegistryProvider extends BasicDataProvider {
  readonly type = 'MockChildrenNationalRegistry'

  async provide(application: Application): Promise<PersonResidenceChange[]> {
    const crcApplication = (application as unknown) as CRCApplication
    return (
      crcApplication.answers?.mockData?.childrenNationalRegistry?.data ||
      this.handleError()
    )
  }
  handleError() {
    return Promise.resolve([
      {
        id: '1',
        name: 'Ólafur Helgi Eiríksson',
        ssn: '123456-7890',
        address: 'Vesturgata 22',
        postalCode: '101',
        city: 'Reykjavík',
      },
      {
        id: '2',
        name: 'Rósa Líf Eiríksdóttir',
        ssn: '123456-7890',
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
