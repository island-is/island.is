import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { NationalRegistry, DataProviderTypes } from '../types'

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry

  async provide(): Promise<NationalRegistry> {
    return {
      address: {
        city: 'Reykjavík',
        postalCode: '113',
        streetName: 'Öskubakki 15',
      },
      children: [
        {
          fullName: 'Barn 1',
          nationalId: '8555210120',
          otherParent: {
            address: {
              city: 'Reykjavík',
              postalCode: '105',
              streetName: 'Bólstaðarhlíð',
            },
            fullName: 'Tester Testers',
            nationalId: '2209862339',
          },
          livesWithApplicant: true,
        },
        {
          fullName: 'Barn 2',
          nationalId: '7112433408',
          otherParent: {
            address: {
              city: 'Reykjavík',
              postalCode: '105',
              streetName: 'Bólstaðarhlíð',
            },
            fullName: 'Tester Testers',
            nationalId: '2209862339',
          },
          livesWithApplicant: true,
        },
      ],
      fullName: 'Ólafur pái Höskuldsson',
      nationalId: '3311305959',
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
