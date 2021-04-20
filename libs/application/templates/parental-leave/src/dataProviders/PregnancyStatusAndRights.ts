import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Right } from '@island.is/clients/vmst'

import { PregnancyStatus } from './APIDataTypes'

export class PregnancyStatusAndRights extends BasicDataProvider {
  type = 'PregnancyStatusAndRights'

  async queryPregnancyStatus(): Promise<PregnancyStatus> {
    const query = `
      query GetPregnancyStatus {
        getPregnancyStatus {
          hasActivePregnancy
          pregnancyDueDate
        }
      }
    `

    return await this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.getPregnancyStatus)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(): Promise<Right & PregnancyStatus> {
    const data = await this.queryPregnancyStatus()

    const query = `
      query GetParentalLeavesEntitlements($input: GetParentalLeavesEntitlementsInput!) {
        getParentalLeavesEntitlements(input: $input) {
          independentMonths
          transferableMonths
        }
      }
    `

    return this.useGraphqlGateway(query, {
      input: { dateOfBirth: data.pregnancyDueDate ?? null },
    })
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve({
          ...response.data.getParentalLeavesEntitlements,
          ...data,
        })
      })
      .catch((error) => this.handleError(error))
  }

  handleError(error: Error | unknown) {
    console.error('Provider error - PregnancyStatusAndRights:', error)
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(data: object): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data,
      status: 'success',
    }
  }
}
