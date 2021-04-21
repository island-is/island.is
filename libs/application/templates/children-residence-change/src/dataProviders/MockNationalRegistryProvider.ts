import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { NationalRegistry, DataProviderTypes, CRCApplication } from '../types'

export class MockNationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.MockNationalRegistry

  async provide(application: Application): Promise<NationalRegistry> {
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
    const crcApplication = (application as unknown) as CRCApplication
    const {
      answers: {
        mockData: { parents, children },
      },
    } = crcApplication
    if (!children) {
      throw new Error('Engin börn fundust í þinni forsjá')
    }
    const childrenArray = children.map((child) => ({
      ...child,
      livesWithApplicant: child?.livesWithApplicant?.includes('yes') || false,
      otherParent: parents[child.otherParent],
    }))
    return this.useGraphqlGateway(query)
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
          children: childrenArray,
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
