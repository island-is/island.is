import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { CRCApplication } from '../types'

/** This is a temporary mock provider for children residence change. National registry team are setting up real provider which we will connect to once it is up. **/
export class MockParentNationalRegistryProvider extends BasicDataProvider {
  readonly type = 'MockParentNationalRegistry'

  async provide(application: Application): Promise<PersonResidenceChange> {
    const crcApplication = (application as unknown) as CRCApplication
    return (
      crcApplication.answers?.mockData?.parentNationalRegistry?.data ||
      this.handleError()
    )
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
  onProvideSuccess(
    result: PersonResidenceChange,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
