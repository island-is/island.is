import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import {
  ChildApplicationLink,
  ChildInformation,
  ChildInformationWithoutRights,
  ExistingChildApplication,
  ParentalRelations,
  PregnancyStatus,
  States,
  calculateRemainingNumberOfDays,
  getApplicationExternalData,
  getSelectedChild,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave'
import {
  Application,
  CustomTemplateFindQuery,
} from '@island.is/application/types'
import {
  ParentalLeave,
  ParentalLeaveApi,
  Right as ParentalLeaveEntitlement,
  PregnancyApi,
} from '@island.is/clients/vmst'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import { MOCK_APPLICATION_FUND_ID } from '../constants'
import {
  applicationsToChildInformation,
  applicationsToExistingChildApplication,
  collectChildren,
  getChildren,
  getChildrenFromMockData,
  vmstParentalLeavesToChildApplicationLinks,
} from './children-utils'

import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

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
  ): Promise<{
    children: ChildInformation[]
    existingApplications: ExistingChildApplication[]
    childApplicationLinks: ChildApplicationLink[]
  }> {
    const customTemplateFindQuery =
      this.applicationApiService.customTemplateFindQuery(
        application.typeId,
      ) as CustomTemplateFindQuery
    const hasOwnMockAnswers =
      getValueViaPath<string>(application.answers, 'mock.useMockData', NO) ===
      YES
    const inheritedMock =
      getValueViaPath<string>(
        application.externalData,
        'previousApplication.data.answers.mock.useMockData',
        NO,
      ) === YES
    const shouldUseMockData =
      (hasOwnMockAnswers || inheritedMock) && !this.isRunningOnProduction

    if (shouldUseMockData) {
      return await this.getMockData(
        application,
        customTemplateFindQuery,
        hasOwnMockAnswers,
      )
    }

    const parentalLeavesAndPregnancyStatus =
      await this.queryParentalLeavesAndPregnancyStatus(nationalId)

    const { children, existingApplications, childApplicationLinks } =
      await this.childrenAndExistingApplications(
        application,
        customTemplateFindQuery,
        parentalLeavesAndPregnancyStatus.getPregnancyStatus,
        parentalLeavesAndPregnancyStatus.getParentalLeaves,
      )

    const childrenResult: ChildInformation[] = []

    for (const child of children) {
      const parentalLeavesEntitlements =
        await this.getParentalLeavesEntitlements(
          child.expectedDateOfBirth === ''
            ? new Date(child.adoptionDate!)
            : new Date(child.expectedDateOfBirth),
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

    return {
      children: childrenResult,
      existingApplications,
      childApplicationLinks,
    }
  }

  async getMockData(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
    hasOwnMockAnswers = true,
  ): Promise<{
    children: ChildInformation[]
    existingApplications: ExistingChildApplication[]
    childApplicationLinks: ChildApplicationLink[]
  }> {
    // Resolved the same way as the real path so the change flow can be exercised
    // with mock data: mock-apply for a child, then start another application and
    // the child comes back as changeable — without having to retype the exact same
    // date of birth, which is the only thing children are matched on.
    const applicationsWhereApplicant = await this.applicationsWhereApplicant(
      application,
      customTemplateFindQuery,
    )
    const existingApplications = applicationsToExistingChildApplication(
      applicationsWhereApplicant,
    )
    const childrenFromEarlierApplications = applicationsToChildInformation(
      applicationsWhereApplicant,
    ) as ChildInformation[]

    // Mock inherited from the predecessor rather than answered here: there are no
    // mock answers on this application to synthesize a child from, and none are
    // wanted — the child being changed is the predecessor's, which is already in
    // `childrenFromEarlierApplications`.
    if (!hasOwnMockAnswers) {
      return {
        children: childrenFromEarlierApplications,
        existingApplications,
        childApplicationLinks: [],
      }
    }

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
          children: childrenFromEarlierApplications,
          existingApplications,
          childApplicationLinks: [],
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
        children: collectChildren(
          [childrenFromEarlierApplications, [children]],
          existingApplications,
        ) as ChildInformation[],
        existingApplications,
        childApplicationLinks: [],
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

      // Linking to an existing application is `collectChildren`'s job below.
      children.push({
        ...child,
        remainingDays,
        hasRights:
          (parentalLeavesEntitlements?.independentMonths ?? 0) > 0 ||
          (parentalLeavesEntitlements?.transferableMonths ?? 0) > 0,
      })
    }

    return {
      children: collectChildren(
        [childrenFromEarlierApplications, children],
        existingApplications,
      ) as ChildInformation[],
      existingApplications,
      childApplicationLinks: [],
    }
  }

  /**
   * The applicant's own parental leave applications. Excludes prerequisites-state
   * applications: those are throwaway shells created just to reach the
   * select-child screen, including the one this provider is running for.
   */
  private async applicationsWhereApplicant(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<Application[]> {
    return (
      await customTemplateFindQuery({ applicant: application.applicant })
    ).filter(
      ({ id, state }) =>
        state !== States.PREREQUISITES && id !== application.id,
    )
  }

  async childrenAndExistingApplications(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
    pregnancyStatus?: PregnancyStatus | null,
    vmstParentalLeaves?: ParentalLeave[] | null,
  ): Promise<{
    children: ChildInformationWithoutRights[]
    existingApplications: ExistingChildApplication[]
    childApplicationLinks: ChildApplicationLink[]
  }> {
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
    if (getAppsWhereOtherParentHasApplied.length <= 0) {
      getAppsWhereOtherParentHasApplied = await customTemplateFindQuery({
        'externalData.VMSTOtherParent.data.otherParentId':
          application.applicant,
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

        // The primary parent's application has to have reached VMST, otherwise the
        // secondary parent is offered a child they cannot apply for: VMST answers
        // their submit with "Móðir þarf að stofna umsókn fyrst".

        // A mock application was never sent to VMST — `sendApplication` hands back
        // the mock fund id without calling out at all — so it cannot support a real
        // secondary parent no matter what state it reached. Deliberately not gated
        // on `isInProgress`: mock-approving walks the application straight to
        // `vinnumalastofnunApproval`, which that list does not cover.
        //
        // Only real applicants get here; `provideChildren` diverts a mock one to
        // `getMockData`, which never consults the other-parent list.
        if (applicationFundId === MOCK_APPLICATION_FUND_ID) {
          return false
        }

        // `!applicationFundId` rather than `=== ''`: "no fund id" arrives as both
        // an empty string and null, depending on which provider last ran.
        if (isInProgress && !applicationFundId) {
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

    const vmstExistingApplications = vmstParentalLeaves
      ? vmstParentalLeaves
          .filter(
            ({ applicationId, expectedDateOfBirth, adoptionDate }) =>
              !!applicationId && (!!expectedDateOfBirth || !!adoptionDate),
          )
          .map(
            ({
              applicationId,
              expectedDateOfBirth,
              adoptionDate,
              applicationFundId,
            }) => ({
              applicationId: applicationId!,
              expectedDateOfBirth: expectedDateOfBirth ?? '',
              adoptionDate: adoptionDate || undefined,
              hasApplicationFundId: !!applicationFundId,
              isChangeInProgress: false,
            }),
          )
      : []

    // Preserve prior links so a transient VMST omission cannot forget a link
    // the applicant already relies on.
    const previousChildApplicationLinks = getValueViaPath<
      ChildApplicationLink[]
    >(application.externalData, 'children.data.childApplicationLinks', [])

    const childApplicationLinks = vmstParentalLeavesToChildApplicationLinks(
      vmstParentalLeaves ?? [],
      previousChildApplicationLinks,
    )

    return getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatus,
      vmstExistingApplications,
      childApplicationLinks,
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
