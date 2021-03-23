import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { NationalRegistry, DataProviderTypes, CRCApplication } from '../types'

export class MockNationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.MOCK_NationalRegistry

  async provide(application: Application): Promise<NationalRegistry> {
    const crcApplication = (application as unknown) as CRCApplication
    const {
      answers: {
        mockData: { parents, children },
      },
    } = crcApplication
    if (!children) {
      throw new Error('Ekki tókst að ná í upplýsingar um börn í þinni forsjá')
    }
    const childrenArray: NationalRegistry['children'] = []
    children?.map((child) => {
      childrenArray.push({
        ...child,
        livesWithApplicant: child?.livesWithApplicant?.includes('yes') || false,
        otherParent: parents[child.otherParent],
      })
    })
    return {
      nationalId: '3311305959',
      fullName: 'Ólafur pái Höskuldsson',
      address: {
        streetName: 'Öskubakki 15',
        postalCode: '113',
        city: 'Reykjavík',
      },
      children: childrenArray,
    }
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
