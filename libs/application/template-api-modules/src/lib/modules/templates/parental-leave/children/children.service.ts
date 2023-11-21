import {
  Application,
  CustomTemplateFindQuery,
  YesOrNo,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import {
  States,
  YES,
  NO,
  calculateRemainingNumberOfDays,
  parentalLeaveFormMessages,
  getSelectedChild,
  ParentalRelations,
  ChildInformation,
  ChildrenAndExistingApplications,
  ChildrenWithoutRightsAndExistingApplications,
  PregnancyStatus,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'
import {
  PregnancyApi,
  ParentalLeaveApi,
  ParentalLeave,
  Right as ParentalLeaveEntitlement,
} from '@island.is/clients/vmst'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import {
  applicationsToChildInformation,
  getChildrenAndExistingApplications,
  getChildrenFromMockData,
} from './children-utils'

import { TemplateApiError } from '@island.is/nest/problem'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ChildrenService {
  isRunningInDevelopment = process.env.NODE_ENV !== 'production'
  isRunningOnProduction = isRunningOnEnvironment('production')

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly applicationApiService: ApplicationApiService,
    private parentalLeaveApi: ParentalLeaveApi,
    private pregnancyApi: PregnancyApi,
  ) {}

  async provideChildren(
    application: Application,
    nationalId: string,
  ): Promise<ChildrenAndExistingApplications> {
    const customTemplateFindQuery =
      this.applicationApiService.customTemplateFindQuery(
        application.typeId,
      ) as CustomTemplateFindQuery
    const useMockData =
      getValueViaPath<string>(application.answers, 'mock.useMockData', NO) ===
      YES
    const shouldUseMockData = useMockData && !this.isRunningOnProduction

    if (shouldUseMockData) {
      return await this.getMockData(application, customTemplateFindQuery)
    }

    const parentalLeavesAndPregnancyStatus =
      await this.queryParentalLeavesAndPregnancyStatus(nationalId)

    const { children, existingApplications } =
      await this.childrenAndExistingApplications(
        application,
        customTemplateFindQuery,
        parentalLeavesAndPregnancyStatus.getPregnancyStatus,
      )

    const childrenResult: ChildInformation[] = []

    for (const child of children) {
      const parentalLeavesEntitlements =
        await this.getParentalLeavesEntitlements(
          new Date(child.expectedDateOfBirth),
          nationalId,
        )

      if (
        child.parentalRelation === ParentalRelations.secondary &&
        child.expectedDateOfBirth === 'N/A' &&
        child.primaryParentNationalRegistryId === 'N/A'
      ) {
        throw new TemplateApiError(
          parentalLeaveFormMessages.shared.noConsentToSeeInfromationError,
          500,
        )
      }

      if (!parentalLeavesEntitlements) {
        throw new TemplateApiError(
          parentalLeaveFormMessages.shared.childrenError,
          500,
        )
      }

      const transferredDays: number = child.transferredDays ?? 0

      const multipleBirthsDays: number = child.multipleBirthsDays ?? 0

      // Transferred days are only added to remaining days for secondary parents
      // since the primary parent makes the choice for them
      const remainingDays =
        calculateRemainingNumberOfDays(
          child.expectedDateOfBirth === ''
            ? child.adoptionDate!
            : child.expectedDateOfBirth,
          parentalLeavesAndPregnancyStatus.getParentalLeaves,
          parentalLeavesEntitlements,
        ) +
        transferredDays +
        multipleBirthsDays

      childrenResult.push({
        ...child,
        remainingDays,
        hasRights:
          (parentalLeavesEntitlements?.independentMonths ?? 0) > 0 ||
          (parentalLeavesEntitlements?.transferableMonths ?? 0) > 0,
      })
    }

    if (children.length <= 0 && existingApplications.length <= 0) {
      // Instead of throwing error, ask applicant questions
      // foster care or father without mother

      return {
        children: [],
        existingApplications: [],
      }
    }

    return {
      children: childrenResult,
      existingApplications,
    }
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
      const useNoPrimaryParent = getValueViaPath(
        application.answers,
        'mock.noPrimaryParent',
        NO,
      ) as YesOrNo

      if (useNoPrimaryParent === YES) {
        return {
          children: [],
          existingApplications: [],
        }
      }

      const children = getChildrenFromMockData(application)

      if (!children.hasRights) {
        throw new TemplateApiError(
          parentalLeaveFormMessages.shared.childrenError,
          500,
        )
      }

      if (
        children.parentalRelation === ParentalRelations.secondary &&
        children.expectedDateOfBirth === 'N/A' &&
        children.primaryParentNationalRegistryId === 'N/A'
      ) {
        throw new TemplateApiError(
          parentalLeaveFormMessages.shared.noConsentToSeeInfromationError,
          500,
        )
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

    // Enable if you want to add ExistingApplications to mockData
    // const { children: child, existingApplications } =
    //   await this.childrenAndExistingApplications(
    //     application,
    //     customTemplateFindQuery,
    //     null,
    //   )

    const children: ChildInformation[] = []

    for (const child of childrenWhereOtherParent) {
      if (
        child.parentalRelation === ParentalRelations.secondary &&
        child.expectedDateOfBirth === 'N/A' &&
        child.primaryParentNationalRegistryId === 'N/A'
      ) {
        throw new TemplateApiError(
          parentalLeaveFormMessages.shared.noConsentToSeeInfromationError,
          500,
        )
      }
      const parentalLeavesEntitlements: ParentalLeaveEntitlement = {
        independentMonths: 6,
        transferableMonths: 0,
      }

      const transferredDays: number = child.transferredDays ?? 0
      const multipleBirthsDays: number = child.multipleBirthsDays ?? 0

      const remainingDays =
        calculateRemainingNumberOfDays(
          child.expectedDateOfBirth === ''
            ? child.adoptionDate!
            : child.expectedDateOfBirth,
          [],
          parentalLeavesEntitlements,
        ) +
        transferredDays +
        multipleBirthsDays

      children.push({
        ...child,
        remainingDays,
        hasRights:
          (parentalLeavesEntitlements?.independentMonths ?? 0) > 0 ||
          (parentalLeavesEntitlements?.transferableMonths ?? 0) > 0,
      })
    }

    return {
      children,
      existingApplications: [],
    }
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
    const applicationsWhereOtherParentHasApplied =
      getAppsWhereOtherParentHasApplied.filter((application) => {
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
      })

    return getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatus,
    )
  }

  async queryParentalLeavesAndPregnancyStatus(nationalId: string): Promise<{
    getParentalLeaves: ParentalLeave[] | null
    getPregnancyStatus: PregnancyStatus | null
  }> {
    const parentalLeaves = await this.getParentalLeaves(nationalId)
    const pregnancyStatus = await this.getPregnancyStatus(nationalId)

    return {
      getParentalLeaves: parentalLeaves,
      getPregnancyStatus: pregnancyStatus,
    }
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    if (this.isRunningInDevelopment) {
      return []
    }

    try {
      const results =
        await this.parentalLeaveApi.parentalLeaveGetParentalLeaves({
          nationalRegistryId: nationalId,
        })

      return results.parentalLeaves ?? []
    } catch (e) {
      this.logger.error(`Could not fetch parental leaves for ${nationalId}`, e)

      return null
    }
  }

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    if (this.isRunningInDevelopment) {
      /**
       * VMST does not really support cleaning up of applications, but with the help of a developer who is working for them
       * we got to relax a limitation on Dev which allows us to have more applications then we would ordinarily be able to create.
       * The limitation in question is that VMST allows only one application at a time for a given parent(or something like that).
       * On Dev however we can create as many as we want as long as the baby birth date is not on the same day.
       */
      const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
      return {
        hasActivePregnancy: true,
        expectedDateOfBirth: formatISO(
          addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
          {
            representation: 'date',
          },
        ),
      }
    }

    try {
      const pregnancyStatus =
        await this.pregnancyApi.pregnancyGetPregnancyStatus({
          nationalRegistryId: nationalId,
        })

      if (pregnancyStatus.hasError) {
        throw new Error(
          pregnancyStatus.errorMessage ?? 'Could not fetch pregnancy status',
        )
      }

      if (
        pregnancyStatus.hasActivePregnancy === undefined ||
        pregnancyStatus.pregnancyDueDate === undefined ||
        pregnancyStatus.pregnancyDueDate === null
      ) {
        return null
      }

      return {
        hasActivePregnancy: pregnancyStatus.hasActivePregnancy,
        expectedDateOfBirth: format(
          pregnancyStatus.pregnancyDueDate,
          'yyyy-MM-dd',
        ),
      }
    } catch (e) {
      this.logger.error(`Could not fetch pregnancy status for ${nationalId}`, e)

      return null
    }
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: Date,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement | null> {
    if (this.isRunningInDevelopment) {
      return {
        independentMonths: 6,
        transferableMonths: 1.5,
      }
    }

    try {
      const rights = await this.parentalLeaveApi.parentalLeaveGetRights({
        nationalRegistryId: nationalId,
        dateOfBirth,
      })

      if (!rights.independentMonths || !rights.transferableMonths) {
        return null
      }

      return {
        independentMonths: rights.independentMonths,
        transferableMonths: rights.transferableMonths,
      }
    } catch (e) {
      this.logger.error(
        `Could not fetch parental leaves entitlements for ${nationalId}, ${dateOfBirth}`,
        e,
      )

      return null
    }
  }
}
