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

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        const returnObject = {
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
        }

        return Promise.resolve(returnObject as any)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }
  handleError(error: any) {
    console.log('Provider error - NationalRegistry:', error)
    return Promise.resolve({})
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
