import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  CustomTemplateFindQuery,
  StaticText,
} from '@island.is/application/core'

import { ChildInformation, ChildrenAndExistingApplications } from './types'
import { getChildrenAndExistingApplications } from './Children-utils'
import { States } from '../../constants'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  PregnancyStatus,
} from '../../types/schema'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { calculateRemainingNumberOfDays } from '../../lib/directorateOfLabour.utils'

export interface PregnancyStatusAndRightsResults {
  childrenAndExistingApplications: ChildrenAndExistingApplications
  remainingDays: number
  hasRights: boolean
  hasActivePregnancy: boolean
}

const parentalLeavesAndPregnancyStatus = `
  query GetParentalLeavesAndPregnancyStatus {
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
      expectedDateOfBirth
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

export class Children extends BasicDataProvider {
  type = 'Children'

  async queryParentalLeavesAndPregnancyStatus(): Promise<{
    getParentalLeaves: ParentalLeave[] | null
    getPregnancyStatus: PregnancyStatus | null
  }> {
    return await this.useGraphqlGateway(parentalLeavesAndPregnancyStatus)
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

  async childrenAndExistingApplications(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
    pregnancyStatus?: PregnancyStatus | null,
  ): Promise<ChildrenAndExistingApplications> {
    // Applications where this parent is applicant
    const applicationsWhereApplicant = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    ).filter(({ state }) => state !== States.PREREQUISITES)

    // Applications where this parent is other parent
    const applicationsWhereOtherParentHasApplied = (
      await customTemplateFindQuery({
        'answers.otherParentId': application.applicant,
      })
    ).filter(
      ({ state }) => state !== States.PREREQUISITES && state !== States.DRAFT,
    )

    return getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatus,
    )
  }

  remainingDays(
    dateOfBirth: string,
    parentalLeaves: ParentalLeave[] | null,
    rights: ParentalLeaveEntitlement,
  ) {
    return calculateRemainingNumberOfDays(dateOfBirth, parentalLeaves, rights)
  }

  async provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<PregnancyStatusAndRightsResults> {
    const parentalLeavesAndPregnancyStatus = await this.queryParentalLeavesAndPregnancyStatus()
    const dateOfBirth =
      parentalLeavesAndPregnancyStatus.getPregnancyStatus?.expectedDateOfBirth

    if (!dateOfBirth) {
      return Promise.reject({
        reason: parentalLeaveFormMessages.shared.pregnancyStatusAndRightsError,
      })
    }

    const parentalLeavesEntitlements = await this.queryParentalLeavesEntitlements(
      dateOfBirth,
    )

    const childrenAndExistingApplications = await this.childrenAndExistingApplications(
      application,
      customTemplateFindQuery,
      parentalLeavesAndPregnancyStatus.getPregnancyStatus,
    )
    const remainingDays = this.remainingDays(
      dateOfBirth,
      parentalLeavesAndPregnancyStatus.getParentalLeaves,
      parentalLeavesEntitlements,
    )

    if (
      childrenAndExistingApplications.children.length <= 0 ||
      childrenAndExistingApplications.existingApplications.length <= 0
    ) {
      return Promise.reject({
        reason: parentalLeaveFormMessages.shared.childrenError,
      })
    }

    return {
      childrenAndExistingApplications,
      remainingDays,
      hasRights: parentalLeavesEntitlements?.independentMonths > 0,
      hasActivePregnancy:
        parentalLeavesAndPregnancyStatus.getPregnancyStatus
          ?.hasActivePregnancy ?? false,
    }
  }

  handleError(error: Error | unknown) {
    console.error('Provider.ParentalLeave.Children:', error)
    return Promise.reject('Failed to fetch children')
  }

  onProvideSuccess(children: ChildInformation[]): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: children,
      status: 'success',
    }
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure',
    }
  }
}
