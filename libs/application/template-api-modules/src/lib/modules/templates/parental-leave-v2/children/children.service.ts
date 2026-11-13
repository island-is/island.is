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
  errorMessages,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave-v2'
import {
  Application,
  ApplicationTypes,
  CustomTemplateFindQuery,
} from '@island.is/application/types'
import {
  describeVmstError,
  ParentalLeave,
  ParentalLeaveApi,
  Right as ParentalLeaveEntitlement,
  PregnancyApi,
  fetchParentalLeaves,
} from '@island.is/clients/vmst'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import format from 'date-fns/format'
import uniqBy from 'lodash/uniqBy'
import {
  applicationsToChildInformation,
  applicationsToExistingChildApplication,
  applicationsToInProgressChildApplications,
  childApplicationLinksToExistingChildApplications,
  collectChildren,
  getChildren,
  getChildrenFromMockData,
  vmstLeavesToChildCandidates,
  isPrimaryParentApplicationForOtherParent,
  sortApplicationsByRelevance,
  vmstParentalLeavesToChildApplicationLinks,
} from './children-utils'
import { MockPregnancyApi } from './mock-pregnancy.api'
import {
  getStoredVmstParentalLeaves,
  VmstParentalLeavesData,
} from '../vmst-parental-leaves'

import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { MOCK_APPLICATION_FUND_ID } from '../constants'

const ISLAND_IS_APPLICATION_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// The case number VMST gave an application. Changes and residence grants that
// continue a leave share it, so only the application that started the leave
// is read.
const caseNumbersOf = (application: Application): string[] =>
  [
    getValueViaPath<unknown>(application.externalData, 'sentToVMST.data.id'),
    getValueViaPath<unknown>(
      application.externalData,
      'sendApplication.data.id',
    ),
    getValueViaPath<unknown>(application.externalData, 'navId.data'),
  ].filter(
    (id): id is string =>
      typeof id === 'string' && !!id && id !== MOCK_APPLICATION_FUND_ID,
  )

// A change or residence grant continues the leave in its `initialQuery`
const startedLeave = (application: Application): boolean =>
  !getValueViaPath<string>(application.answers, 'initialQuery')

@Injectable()
export class ChildrenService {
  isRunningInDevelopment = process.env.NODE_ENV !== 'production'
  isRunningOnProduction = isRunningOnEnvironment('production')

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly applicationApiService: ApplicationApiService,
    private parentalLeaveApi: ParentalLeaveApi,
    private pregnancyApi: PregnancyApi,
    private mockPregnancyApi: MockPregnancyApi,
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
    const shouldUseMockData =
      getValueViaPath<string>(application.answers, 'mock.useMockData', NO) ===
        YES && !this.isRunningOnProduction

    if (shouldUseMockData) {
      return await this.getMockData(application, customTemplateFindQuery)
    }

    const parentalLeavesAndPregnancyStatus =
      await this.queryParentalLeavesAndPregnancyStatus(
        nationalId,
        getStoredVmstParentalLeaves(application),
      )

    // Without VMST's list it is not known which children already have a leave,
    // so a child could be offered as new and applied for twice. Development
    // falls back to the applicant's own applications instead.
    if (
      parentalLeavesAndPregnancyStatus.getParentalLeaves === null &&
      !this.isRunningInDevelopment
    ) {
      throw new TemplateApiError(
        {
          title: errorMessages.parentalLeavesUnavailableTitle,
          summary: errorMessages.parentalLeavesUnavailableSummary,
        },
        500,
      )
    }

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
  ): Promise<{
    children: ChildInformation[]
    existingApplications: ExistingChildApplication[]
    childApplicationLinks: ChildApplicationLink[]
  }> {
    // Children from earlier applications are listed so a mocked child does not
    // have to be retyped. A mock application never reached VMST, so its child is
    // never offered as a change: `applicationsToExistingChildApplication` leaves
    // mock applications out. Unfinished applications come first, same as in
    // `getChildren`, so a child whose application has not reached VMST yet is
    // held as in progress instead of being offered as a change VMST would refuse.
    const applicationsWhereApplicant = sortApplicationsByRelevance(
      await this.applicationsWhereApplicant(
        application,
        customTemplateFindQuery,
      ),
    )
    const existingApplications = [
      ...applicationsToInProgressChildApplications(applicationsWhereApplicant),
      ...applicationsToExistingChildApplication(applicationsWhereApplicant),
    ]
    const childrenFromEarlierApplications = applicationsToChildInformation(
      applicationsWhereApplicant,
    ) as ChildInformation[]

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
          children: collectChildren(
            [childrenFromEarlierApplications],
            existingApplications,
          ) as ChildInformation[],
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
    const applicationsWhereApplicant = await this.applicationsWhereApplicant(
      application,
      customTemplateFindQuery,
    )

    const applicationsWhereOtherParentHasApplied = (
      await this.applicationsWhereOtherParent(
        application,
        customTemplateFindQuery,
      )
    ).filter(isPrimaryParentApplicationForOtherParent)

    // Preserve prior links so a transient VMST omission cannot forget a link
    // the applicant already relies on.
    const previousChildApplicationLinks = getValueViaPath<
      ChildApplicationLink[]
    >(application.externalData, 'children.data.childApplicationLinks', [])

    const childApplicationLinks = vmstParentalLeavesToChildApplicationLinks(
      vmstParentalLeaves ?? [],
      previousChildApplicationLinks,
    )

    // The links are the leaves `verifyFollowUpLeave` accepts a change for, so
    // they are the only change options while VMST's list is available.
    const vmstLeaves = vmstParentalLeaves
      ? childApplicationLinksToExistingChildApplications(childApplicationLinks)
      : null

    return getChildren(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatus,
      vmstLeaves,
      childApplicationLinks,
      vmstLeavesToChildCandidates(vmstParentalLeaves ?? []),
    )
  }

  /**
   * Applications that name the applicant as other parent. The other parent's id
   * has been stored in three places over time, so all three are searched.
   */
  private async applicationsWhereOtherParent(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<Application[]> {
    // TODO: remove answers.otherParentId
    const results = await Promise.all(
      [
        'answers.otherParentObj.otherParentId',
        'answers.otherParentId',
        'externalData.VMSTOtherParent.data.otherParentId',
      ].map((path) =>
        customTemplateFindQuery({ [path]: application.applicant }),
      ),
    )

    const byId = new Map<string, Application>()
    for (const found of results.flat()) {
      byId.set(found.id, found)
    }

    return Array.from(byId.values())
  }

  async queryParentalLeavesAndPregnancyStatus(
    nationalId: string,
    // Gathered by the VMST provider, which runs first; fetched here otherwise
    storedVmstParentalLeaves?: VmstParentalLeavesData,
  ): Promise<{
    getParentalLeaves: ParentalLeave[] | null
    getPregnancyStatus: PregnancyStatus | null
  }> {
    const parentalLeaves = storedVmstParentalLeaves
      ? storedVmstParentalLeaves.parentalLeaves
      : await this.getParentalLeaves(nationalId)
    const pregnancyStatus = await this.getPregnancyStatus(nationalId)

    return {
      getParentalLeaves: parentalLeaves,
      getPregnancyStatus: pregnancyStatus,
    }
  }

  /**
   * VMST lists each leave under its case number, but looking a leave up
   * (`GET /applications/{id}`) and changing it take the island.is id of the
   * application that started it. That V2 or V1 application keeps the case
   * number VMST gave it, so the id is found through it; changes and residence
   * grants share the case number and are skipped. Pruned applications count
   * too: V2 keeps the case number and `initialQuery` after pruning until its
   * leave can no longer be changed (`adminDataConfig`). A leave no island.is
   * application started (on paper or at VMST) cannot be looked up and is left
   * out.
   */
  async withIslandIsApplicationIds(
    applicant: string,
    parentalLeaves: ParentalLeave[],
  ): Promise<ParentalLeave[]> {
    if (
      parentalLeaves.every(({ applicationId }) =>
        ISLAND_IS_APPLICATION_ID.test(applicationId),
      )
    ) {
      return parentalLeaves
    }

    const typeIds = [
      ApplicationTypes.PARENTAL_LEAVE_V2,
      ApplicationTypes.PARENTAL_LEAVE,
    ]
    const [current, includingPruned] = await Promise.all([
      Promise.all(
        typeIds.map((typeId) =>
          this.applicationApiService.customTemplateFindQuery(typeId)({
            applicant,
          }),
        ),
      ),
      // The only query that returns pruned applications, but only listed ones
      // and also those the applicant is assigned to
      this.applicationApiService.findAllByNationalIdAndFilters(
        applicant,
        typeIds.join(','),
        undefined,
        true,
      ),
    ])
    const applications = uniqBy(
      [...current.flat(), ...includingPruned] as unknown as Application[],
      'id',
    ).filter(
      (application) =>
        application.applicant === applicant && startedLeave(application),
    )

    const idByCaseNumber = new Map<string, string>()
    for (const application of applications) {
      for (const caseNumber of caseNumbersOf(application)) {
        if (!idByCaseNumber.has(caseNumber)) {
          idByCaseNumber.set(caseNumber, application.id)
        }
      }
    }

    return parentalLeaves.flatMap((leave) => {
      if (ISLAND_IS_APPLICATION_ID.test(leave.applicationId)) {
        return [leave]
      }

      const caseNumber = leave.applicationFundId || leave.applicationId
      const applicationId = idByCaseNumber.get(caseNumber)

      return applicationId
        ? [{ ...leave, applicationId, applicationFundId: caseNumber }]
        : []
    })
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    // Called in every environment, development included: a follow-up can only
    // continue a leave this list contains (`getPreviousVmstLeave`).
    try {
      return await this.withIslandIsApplicationIds(
        nationalId,
        await fetchParentalLeaves(this.parentalLeaveApi, nationalId),
      )
    } catch (e) {
      this.logger.error(
        `Could not fetch parental leaves: ${await describeVmstError(e)}`,
      )

      return null
    }
  }

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    // VMST pregnancy status only exists in production, so mocked pregnancies are used elsewhere
    const pregnancyApi = this.isRunningOnProduction
      ? this.pregnancyApi
      : this.mockPregnancyApi

    try {
      const pregnancyStatus = await pregnancyApi.pregnancyGetPregnancyStatus({
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
      this.logger.error(
        `Could not fetch pregnancy status: ${await describeVmstError(e)}`,
      )

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
        `Could not fetch parental leaves entitlements: ${await describeVmstError(
          e,
        )}`,
      )

      return null
    }
  }
}
