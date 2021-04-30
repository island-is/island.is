import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

import { calculateRemainingNumberOfDays } from '../lib/directorateOfLabour.utils'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  PregnancyStatus,
} from '../types/schema'

export interface PregnancyStatusAndRightsResults {
  parentalLeaves: ParentalLeave[]
  pregnancyStatus: PregnancyStatus
  parentalLeavesEntitlements: ParentalLeaveEntitlement
  remainingDays: number
}

export class PregnancyStatusAndRights extends BasicDataProvider {
  type = 'PregnancyStatusAndRights'

  async queryParentalLeaves(): Promise<ParentalLeave[]> {
    const query = `
      query GetParentalLeaves {
        getParentalLeaves {
          applicant
          expectedDateOfBirth
          dateOfBirth
          periods {
            from
            to
            approved
            paid
          }
        }
      }
    `

    return await this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.getParentalLeaves)
      })
      .catch((error) => this.handleError(error))
  }

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

  async queryParentalLeavesEntitlements(
    dateOfBirth: string | null,
  ): Promise<ParentalLeaveEntitlement> {
    const query = `
      query GetParentalLeavesEntitlements($input: GetParentalLeavesEntitlementsInput!) {
        getParentalLeavesEntitlements(input: $input) {
          independentMonths
          transferableMonths
        }
      }
    `

    return this.useGraphqlGateway(query, {
      input: { dateOfBirth },
    })
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.getParentalLeavesEntitlements)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(): Promise<PregnancyStatusAndRightsResults> {
    const parentalLeaves = await this.queryParentalLeaves()
    const pregnancyStatus = await this.queryPregnancyStatus()
    const dateOfBirth = pregnancyStatus.pregnancyDueDate ?? null
    const parentalLeavesEntitlements = await this.queryParentalLeavesEntitlements(
      dateOfBirth,
    )

    const remainingDays = calculateRemainingNumberOfDays(
      dateOfBirth,
      parentalLeaves,
      parentalLeavesEntitlements,
    )

    return Promise.resolve({
      parentalLeaves,
      pregnancyStatus,
      parentalLeavesEntitlements,
      remainingDays,
    })
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
