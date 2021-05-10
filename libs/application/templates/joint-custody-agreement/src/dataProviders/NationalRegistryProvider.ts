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
    const query = `
      query NationalRegistryUserQuery {
        nationalRegistryUser {
          nationalId
          fullName
          address {
            code
            postalCode
            city
            streetAddress
            lastUpdated
          }
        }
      }
    `

    return this.useGraphqlGateway<NationalRegistry>(query)
      .then(async (res: Response) => {
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
              livesWithApplicant: true,
            },
          ],
        }

        return Promise.resolve(returnObject)
      })
      .catch(() => {
        throw new Error('Error from NationalRegistry')
      })
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
