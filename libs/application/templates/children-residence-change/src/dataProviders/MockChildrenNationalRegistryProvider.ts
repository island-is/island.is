import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { CRCApplication } from '../types'

import {
  PersonResidenceChange,
  DataProviderTypes,
} from '@island.is/application/templates/children-residence-change'

export class MockChildrenNationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.MOCK_ChildrenNationalRegistry

  async provide(application: Application): Promise<PersonResidenceChange[]> {
    const crcApplication = (application as unknown) as CRCApplication
    const data =
      crcApplication.answers?.mockData?.childrenNationalRegistry?.data
    if (!data) {
      throw new Error('Ekki tókst að ná í upplýsingar um börn í þinni forsjá')
    }
    return data
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
