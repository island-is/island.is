import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
  coreErrorMessages,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import type { FamilyMember } from '@island.is/api/domains/national-registry'

const isLocalDevelopment = isRunningOnEnvironment('local')
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
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.nationalRegistryFamily)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  handleError(error: Error | unknown) {
    if (isLocalDevelopment) {
      return Promise.resolve([])
    }

    console.error('Provider error - FamilyInformation:', error)
    return Promise.reject({
      reason: coreErrorMessages.errorDataProviderDescription,
    })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    const { reason } = error

    return {
      date: new Date(),
      reason,
      status: 'failure',
      data: [],
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
