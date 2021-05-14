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
        const response = await res.json()
        if (response.errors) {
          throw new Error('Error from NationalRegistry')
        }

        const returnObject: NationalRegistry = {
          fullName: response.data.nationalRegistryUser.fullName,
          nationalId: response.data.nationalRegistryUser.nationalId,
          address: {
            city: response.data.nationalRegistryUser.address.city,
            postalCode: response.data.nationalRegistryUser.address.postalCode,
            streetName:
              response.data.nationalRegistryUser.address.streetAddress,
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
  onProvideSuccess(result: Person): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
