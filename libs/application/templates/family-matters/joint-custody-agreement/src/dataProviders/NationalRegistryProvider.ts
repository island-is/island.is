import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import {
  Person,
  NationalRegistry,
} from '@island.is/application/templates/family-matters-core/types'
import { DataProviderTypes } from '../types'

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry

  async provide(): Promise<NationalRegistry> {
    const returnObject: NationalRegistry = {
      fullName: 'Some name',
      nationalId: '0000000000',
      address: {
        city: 'Reykjavik',
        postalCode: '105',
        streetName: 'Borgartún 26',
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
            nationalId: '1234567890',
          },
          custodyParents: ['0000000000'],
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
            nationalId: '1234567890',
          },
          custodyParents: ['0000000000'],
          livesWithApplicant: true,
        },
      ],
    }

    return Promise.resolve(returnObject)
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: Person): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
