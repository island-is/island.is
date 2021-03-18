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
    const data =
      crcApplication.answers?.mockData?.childrenNationalRegistry?.data
    if (data) {
      return data
    }
    throw new Error('Ekki tókst að ná í upplýsingar um börn í þinni forsjá')
  }

  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(
    result: PersonResidenceChange,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
