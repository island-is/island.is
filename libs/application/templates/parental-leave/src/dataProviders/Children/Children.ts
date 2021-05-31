import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  CustomTemplateFindQuery,
  getValueViaPath,
  StaticText,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/utils/shared'

import {
  ChildInformation,
  ChildrenAndExistingApplications,
  ChildrenWithoutRightsAndExistingApplications,
} from './types'
import {
  getChildrenAndExistingApplications,
  getChildrenFromMockData,
} from './Children-utils'
import { States, YES, NO } from '../../constants'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  PregnancyStatus,
} from '../../types/schema'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { calculateRemainingNumberOfDays } from '../../lib/directorateOfLabour.utils'
import { getSelectedChild } from '../../parentalLeaveUtils'

export interface PregnancyStatusAndRightsResults {
  childrenAndExistingApplications: ChildrenAndExistingApplications
  remainingDays: number
  hasRights: boolean
  hasActivePregnancy: boolean
}

const isRunningOnProduction = isRunningOnEnvironment('production')

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
  ): Promise<ChildrenWithoutRightsAndExistingApplications> {
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
    ).filter((application) => {
      const { state } = application
      const isCompleted =
        state !== States.PREREQUISITES && state !== States.DRAFT

      if (!isCompleted) {
        return false
      }

      const selectedChild = getSelectedChild(
        application.answers,
        application.externalData,
      )
      if (!selectedChild) {
        return false
      }

      // We only use applications from primary parents to allow
      // secondary parents to apply, not the other way around
      if (selectedChild.parentalRelation !== 'primary') {
        return false
      }

      return true
    })

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
  ): Promise<ChildrenAndExistingApplications> {
    const useMockData =
      getValueViaPath(application.answers, 'useMockData', NO) === YES
    const shouldUseMockData = useMockData && !isRunningOnProduction

    if (shouldUseMockData) {
      return getChildrenFromMockData(application)
    }

    const parentalLeavesAndPregnancyStatus = await this.queryParentalLeavesAndPregnancyStatus()

    const {
      children,
      existingApplications,
    } = await this.childrenAndExistingApplications(
      application,
      customTemplateFindQuery,
      parentalLeavesAndPregnancyStatus.getPregnancyStatus,
    )

    const childrenResult: ChildInformation[] = []

    for (const child of children) {
      const parentalLeavesEntitlements = await this.queryParentalLeavesEntitlements(
        child.expectedDateOfBirth,
      )

      const transferredDays =
        child.transferredDays === undefined ? 0 : child.transferredDays

      const remainingDays =
        this.remainingDays(
          child.expectedDateOfBirth,
          parentalLeavesAndPregnancyStatus.getParentalLeaves,
          parentalLeavesEntitlements,
        ) + transferredDays

      childrenResult.push({
        ...child,
        remainingDays,
        hasRights:
          parentalLeavesEntitlements?.independentMonths > 0 ||
          parentalLeavesEntitlements.transferableMonths > 0,
      })
    }

    if (children.length <= 0 && existingApplications.length <= 0) {
      return Promise.reject({
        reason: parentalLeaveFormMessages.shared.childrenError,
      })
    }

    return {
      children: childrenResult,
      existingApplications,
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
