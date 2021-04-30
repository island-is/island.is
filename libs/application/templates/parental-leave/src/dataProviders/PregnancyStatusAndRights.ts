import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

import { calculateRemainingNumberOfDays } from '../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  PregnancyStatus,
} from '../types/schema'

export interface PregnancyStatusAndRightsResults {
  parentalLeaves: ParentalLeave[] | null
  pregnancyStatus: PregnancyStatus | null
  parentalLeavesEntitlements: ParentalLeaveEntitlement
  remainingDays: number
}

const parentalLeavesAndStatus = `
  query GetParentalLeavesAndStatus {
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
    getPregnancyStatus {
      hasActivePregnancy
      pregnancyDueDate
    }
  }
`

const parentalLeavesEntitlements = `
  query GetParentalLeavesEntitlements($input: GetParentalLeavesEntitlementsInput!) {
    getParentalLeavesEntitlements(input: $input) {
      independentMonths
      transferableMonths
    }
  }
`

export class PregnancyStatusAndRights extends BasicDataProvider {
  type = 'PregnancyStatusAndRights'

  async queryParentalLeavesAndStatus(): Promise<{
    getParentalLeaves: ParentalLeave[] | null
    getPregnancyStatus: PregnancyStatus | null
  }> {
    return await this.useGraphqlGateway(parentalLeavesAndStatus)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data)
      })
      .catch((error) => this.handleError(error))
  }

  async queryParentalLeavesEntitlements(
    dateOfBirth: string | null | undefined,
  ): Promise<ParentalLeaveEntitlement> {
    return this.useGraphqlGateway(parentalLeavesEntitlements, {
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
    const parentalLeavesAndStatus = await this.queryParentalLeavesAndStatus()
    const dateOfBirth =
      parentalLeavesAndStatus.getPregnancyStatus?.pregnancyDueDate

    if (!dateOfBirth) {
      return Promise.reject({
        reason:
          this.config.formatMessage?.(
            parentalLeaveFormMessages.shared.pregnancyStatusAndRightsError,
          ) ?? 'Failed',
      })
    }

    const parentalLeavesEntitlements = await this.queryParentalLeavesEntitlements(
      dateOfBirth,
    )

    const remainingDays = calculateRemainingNumberOfDays(
      dateOfBirth,
      parentalLeavesAndStatus.getParentalLeaves,
      parentalLeavesEntitlements,
    )

    return Promise.resolve({
      parentalLeaves: parentalLeavesAndStatus.getParentalLeaves,
      pregnancyStatus: parentalLeavesAndStatus.getPregnancyStatus,
      parentalLeavesEntitlements,
      remainingDays,
    })
  }

  handleError(error: Error | unknown) {
    console.error('Provider error - PregnancyStatusAndRights:', error)
    return Promise.resolve({})
  }

  onProvideError(error: { reason: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: error.reason,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(
    data: PregnancyStatusAndRightsResults,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data,
      status: 'success',
    }
  }
}
