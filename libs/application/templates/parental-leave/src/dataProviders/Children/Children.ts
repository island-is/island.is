import { getValueViaPath } from '@island.is/application/core'
import {
  BasicDataProvider,
  CustomTemplateFindQuery,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  StaticText,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import type {
  ChildInformation,
  ChildrenAndExistingApplications,
  ChildrenWithoutRightsAndExistingApplications,
} from './types'
import {
  applicationsToChildInformation,
  getChildrenAndExistingApplications,
  getChildrenFromMockData,
} from './Children-utils'
import { States, YES, NO, ParentalRelations } from '../../constants'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  PregnancyStatus,
} from '@island.is/api/domains/directorate-of-labour'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { calculateRemainingNumberOfDays } from '../../lib/directorateOfLabour.utils'
import {
  getApplicationExternalData,
  getSelectedChild,
} from '../../lib/parentalLeaveUtils'
import { YesOrNo } from '../../types'

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
          console.error(response.errors)
          return Promise.reject(
            'Response.errors queryParentalLeavesAndPregnancyStatus',
          )
        }

        return Promise.resolve(response.data)
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject(
          'Catch error queryParentalLeavesAndPregnancyStatus',
        )
      })
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
          console.error(response.errors)
          return Promise.reject(
            'Response.errors queryParentalLeavesEntitlements',
          )
        }

        return Promise.resolve(response.data.getParentalLeavesEntitlements)
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject('Catch error queryParentalLeavesEntitlements')
      })
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
    // otherParentId are in two difference places (answers.otheParentId and answers.otherParentObj.otherParentId)
    // TODO: remove answers.otherParentId

    let getAppsWhereOtherParentHasApplied = await customTemplateFindQuery({
      'answers.otherParentObj.otherParentId': application.applicant,
    })
    if (getAppsWhereOtherParentHasApplied.length <= 0) {
      getAppsWhereOtherParentHasApplied = await customTemplateFindQuery({
        'answers.otherParentId': application.applicant,
      })
    }
    const applicationsWhereOtherParentHasApplied = getAppsWhereOtherParentHasApplied.filter(
      (application) => {
        const { state } = application
        const { applicationFundId } = getApplicationExternalData(
          application.externalData,
        )

        const isInProgress =
          state === States.PREREQUISITES ||
          state === States.DRAFT ||
          state === States.OTHER_PARENT_APPROVAL ||
          state === States.OTHER_PARENT_ACTION ||
          state === States.EMPLOYER_WAITING_TO_ASSIGN ||
          state === States.EMPLOYER_APPROVAL ||
          state === States.EMPLOYER_ACTION

        if (isInProgress && applicationFundId === '') {
          // The application of the primary parent has to be completed
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
        if (selectedChild.parentalRelation !== ParentalRelations.primary) {
          return false
        }

        return true
      },
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

  async getMockData(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ) {
    const useApplication = getValueViaPath(
      application.answers,
      'mock.useMockedApplication',
      NO,
    ) as YesOrNo

    if (useApplication === NO) {
      const children = getChildrenFromMockData(application)

      if (!children.hasRights) {
        return Promise.reject({
          reason: parentalLeaveFormMessages.shared.childrenError,
        })
      }

      return {
        children: [children],
        existingApplications: [],
      }
    }

    const applicationId = getValueViaPath(
      application.answers,
      'mock.useMockedApplicationId',
    ) as string

    const applicationFromPrimaryParent = await customTemplateFindQuery({
      id: applicationId,
    })

    const childrenWhereOtherParent = applicationsToChildInformation(
      applicationFromPrimaryParent,
      true,
    )

    const children: ChildInformation[] = []

    for (const child of childrenWhereOtherParent) {
      const parentalLeavesEntitlements = {
        independentMonths: 6,
        transferableMonths: 0,
      }

      const transferredDays =
        child.transferredDays === undefined ? 0 : child.transferredDays
      const multipleBirthsDays =
        child.multipleBirthsDays === undefined ? 0 : child.multipleBirthsDays

      const remainingDays =
        this.remainingDays(
          child.expectedDateOfBirth,
          [],
          parentalLeavesEntitlements,
        ) +
        transferredDays +
        multipleBirthsDays

      children.push({
        ...child,
        remainingDays,
        hasRights:
          parentalLeavesEntitlements.independentMonths > 0 ||
          parentalLeavesEntitlements.transferableMonths > 0,
      })
    }

    return {
      children,
      existingApplications: [],
    }
  }

  async provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<ChildrenAndExistingApplications> {
    const useMockData =
      getValueViaPath<string>(application.answers, 'mock.useMockData', NO) ===
      YES
    const shouldUseMockData = useMockData && !isRunningOnProduction

    if (shouldUseMockData) {
      return await this.getMockData(application, customTemplateFindQuery)
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

      // Transferred days are only added to remaining days for secondary parents
      // since the primary parent makes the choice for them
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
