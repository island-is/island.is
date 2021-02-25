import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

import { FamilyMember } from '@island.is/api/domains/national-registry'

export class FamilyInformationProvider extends BasicDataProvider {
  type = 'FamilyInformationProvider'

  async provide(): Promise<FamilyMember[]> {
    const query = `
      query NationalRegistryFamilyQuery {
        nationalRegistryFamily {
          nationalId
          fullName
          familyRelation
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }

        return Promise.resolve(response.data.nationalRegistryFamily)
      })
      .catch(() => {
        return this.handleError()
      })
  }

  handleError() {
    return Promise.resolve([])
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
