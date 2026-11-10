import { getValueViaPath, NO } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { DistributiveOmit } from '@island.is/shared/types'

import {
  ApplicationAction,
  ParentalRelations,
  States,
  assignChildKeys,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getSelectedChild,
  getTransferredDays,
  isSameChild,
  isSamePregnancy,
  toDay,
  ChildApplicationLink,
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  getApplicationAnswers,
  getApplicationExternalData,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave-v2'
import { TemplateApiError } from '@island.is/nest/problem'
import { MOCK_APPLICATION_FUND_ID } from '../constants'

// We do not require hasRights or remainingDays in this step
// as it will be calculated later in the process
type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

/**
 * Where an island.is application stands. The one classification every list in
 * this file is built from, so "unfinished" or "finished" cannot mean different
 * things in different places.
 */
export enum ApplicationStage {
  // Throwaway shell that only reached the select-child screen.
  PREREQUISITES = 'prerequisites',
  // Unfinished application that is not a change: a first-time application or a
  // residence grant.
  IN_PROGRESS = 'inProgress',
  // Unfinished change application.
  CHANGE_IN_PROGRESS = 'changeInProgress',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

const CHANGE_STATES: readonly string[] = [
  States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
  States.OTHER_PARENT_APPROVAL_FOR_EDITS,
  States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
  States.EMPLOYER_APPROVE_EDITS,
  States.VINNUMALASTOFNUN_APPROVE_EDITS,
  States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS,
]

// States a first-time application passes through before it is sent to VMST.
const BEFORE_VMST_STATES: readonly string[] = [
  States.DRAFT,
  States.OTHER_PARENT_APPROVAL,
  States.EMPLOYER_WAITING_TO_ASSIGN,
  States.EMPLOYER_APPROVAL,
]

export const getApplicationStage = (
  application: Application,
): ApplicationStage => {
  switch (application.state) {
    case States.PREREQUISITES:
      return ApplicationStage.PREREQUISITES
    case States.APPROVED:
      return ApplicationStage.APPROVED
    case States.CLOSED:
      return ApplicationStage.CLOSED
  }

  const { applicationAction } = getApplicationAnswers(application.answers)

  return applicationAction === ApplicationAction.CHANGE ||
    CHANGE_STATES.includes(application.state)
    ? ApplicationStage.CHANGE_IN_PROGRESS
    : ApplicationStage.IN_PROGRESS
}

const isUnfinished = (stage: ApplicationStage) =>
  stage === ApplicationStage.IN_PROGRESS ||
  stage === ApplicationStage.CHANGE_IN_PROGRESS

// A mock application never reaches VMST, so it cannot clash with a real leave
// and there is no leave a change could continue.
const isMockApplication = (application: Application) =>
  getApplicationExternalData(application.externalData).applicationFundId ===
  MOCK_APPLICATION_FUND_ID

// `!applicationFundId` rather than `=== ''`: "no fund id" arrives as both an
// empty string and null, depending on which provider last ran.
const hasFundId = (application: Application) =>
  !!getApplicationExternalData(application.externalData).applicationFundId

/**
 * The VMST application id of the leave an application belongs to. VMST keys a
 * leave on the island.is id of its first application; a follow-up (change or
 * residence grant) continues the leave in its `initialQuery`.
 */
export const getLeaveApplicationId = (
  application: Application,
): string | undefined => {
  const { applicationAction } = getApplicationAnswers(application.answers)

  if (applicationAction === ApplicationAction.APPLY) {
    return application.id
  }

  return (
    getValueViaPath<string>(application.answers, 'initialQuery') || undefined
  )
}

const toTime = (date?: Date | string) => (date ? new Date(date).getTime() : 0)

/**
 * Most relevant first: applications still standing before finished ones, then
 * the most recently modified. Wherever several applications describe the same
 * child, the first one wins, so this is what decides which one that is.
 */
export const sortApplicationsByRelevance = (
  applications: Application[],
): Application[] => {
  const rank = (application: Application) => {
    const stage = getApplicationStage(application)

    return stage === ApplicationStage.CLOSED ||
      stage === ApplicationStage.PREREQUISITES
      ? 1
      : 0
  }

  return [...applications].sort(
    (a, b) => rank(a) - rank(b) || toTime(b.modified) - toTime(a.modified),
  )
}

/**
 * Whether a primary parent's application lets the other parent apply for its
 * child as secondary parent.
 */
export const isPrimaryParentApplicationForOtherParent = (
  application: Application,
): boolean => {
  // A mock application was never sent to VMST — `sendApplication` hands back
  // the mock fund id without calling out at all — so it cannot support a real
  // secondary parent no matter what state it reached.
  if (isMockApplication(application)) {
    return false
  }

  const stage = getApplicationStage(application)

  if (
    stage === ApplicationStage.PREREQUISITES ||
    stage === ApplicationStage.CLOSED
  ) {
    return false
  }

  // The primary parent's application has to have reached VMST, otherwise the
  // secondary parent is offered a child they cannot apply for: VMST answers
  // their submit with "Móðir þarf að stofna umsókn fyrst".
  if (
    BEFORE_VMST_STATES.includes(application.state) &&
    !hasFundId(application)
  ) {
    return false
  }

  // We only use applications from primary parents to allow secondary parents
  // to apply, not the other way around.
  return (
    getSelectedChild(application.answers, application.externalData)
      ?.parentalRelation === ParentalRelations.primary
  )
}

const applicationToChildInformation = (
  application: Application,
  asOtherParent: boolean,
): ChildInformationWithoutRights | null => {
  const { applicantGenderCode } = getApplicationExternalData(
    application.externalData,
  )
  const {
    noChildrenFoundTypeOfApplication,
    otherParentRightOfAccess,
  } = getApplicationAnswers(application.answers)

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (selectedChild === null) {
    return null
  }

  if (!asOtherParent) {
    return selectedChild
  }

  let transferredDays = getTransferredDays(application, selectedChild)
  const multipleBirthsRequestDays = getMultipleBirthRequestDays(
    application.answers,
  )
  const maxMultipleBirthDays = getMaxMultipleBirthsDays(application.answers)

  if (transferredDays !== undefined && transferredDays !== 0) {
    // * -1 because we need to reverse the days over to this parent
    // for example if other parent is requesting 45 days
    // then this parent needs to lose 45 days
    transferredDays *= -1
  }

  if (otherParentRightOfAccess === NO) {
    return {
      parentalRelation: ParentalRelations.secondary,
      expectedDateOfBirth: 'N/A',
      primaryParentNationalRegistryId: 'N/A',
    }
  }

  if (selectedChild.parentalRelation === ParentalRelations.primary) {
    return {
      parentalRelation: ParentalRelations.secondary,
      expectedDateOfBirth: selectedChild.expectedDateOfBirth,
      primaryParentNationalRegistryId: application.applicant,
      transferredDays,
      multipleBirthsDays: maxMultipleBirthDays - multipleBirthsRequestDays,
      primaryParentGenderCode: applicantGenderCode,
      primaryParentTypeOfApplication: noChildrenFoundTypeOfApplication,
      adoptionDate: selectedChild.adoptionDate,
      dateOfBirth: selectedChild.dateOfBirth,
    }
  }

  return {
    parentalRelation: ParentalRelations.primary,
    expectedDateOfBirth: selectedChild.expectedDateOfBirth,
    transferredDays,
  }
}

export const applicationsToChildInformation = (
  applications: Application[],
  asOtherParent = false,
): ChildInformationWithoutRights[] =>
  applications.flatMap((application) => {
    const child = applicationToChildInformation(application, asOtherParent)

    return child ? [child] : []
  })

const toExistingChildApplication = (
  applicationId: string,
  child: ChildInformationWithoutRights,
  progress: Pick<
    ExistingChildApplication,
    'isChangeInProgress' | 'isApplicationInProgress'
  >,
): ExistingChildApplication => ({
  applicationId,
  expectedDateOfBirth: child.expectedDateOfBirth,
  adoptionDate: child.adoptionDate,
  dateOfBirth: child.dateOfBirth,
  ...progress,
})

/**
 * Leaves the applicant has according to their own island.is applications. Only
 * a stand-in for VMST's list when that list could not be fetched: the leave id
 * is the one VMST keys on (`getLeaveApplicationId`), so a change started from it
 * is still checked against VMST before it continues (`verifyFollowUpLeave`).
 */
export const applicationsToExistingChildApplication = (
  applications: Application[],
): ExistingChildApplication[] => {
  const result: ExistingChildApplication[] = []

  for (const application of applications) {
    if (isMockApplication(application)) {
      continue
    }

    const stage = getApplicationStage(application)
    const hasReachedVmst =
      stage === ApplicationStage.APPROVED ||
      (isUnfinished(stage) && hasFundId(application))
    const leaveApplicationId = getLeaveApplicationId(application)
    const child = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (
      !hasReachedVmst ||
      !leaveApplicationId ||
      !child ||
      result.some(({ applicationId }) => applicationId === leaveApplicationId)
    ) {
      continue
    }

    result.push(
      toExistingChildApplication(leaveApplicationId, child, {
        isChangeInProgress: false,
      }),
    )
  }

  return result
}

/**
 * The applicant's own unfinished applications. Each one holds its child: picking
 * that child again would put a second application for the same leave next to
 * it. Read from island.is whatever VMST lists, because VMST does not know about
 * applications still waiting for the other parent or the employer, and does not
 * say whether a change is under way.
 */
export const applicationsToInProgressChildApplications = (
  applications: Application[],
): ExistingChildApplication[] => {
  const result: ExistingChildApplication[] = []

  for (const application of applications) {
    const stage = getApplicationStage(application)

    if (!isUnfinished(stage) || isMockApplication(application)) {
      continue
    }

    const child = getSelectedChild(
      application.answers,
      application.externalData,
    )
    if (child === null) {
      continue
    }

    const isChange = stage === ApplicationStage.CHANGE_IN_PROGRESS

    result.push(
      toExistingChildApplication(application.id, child, {
        isChangeInProgress: isChange,
        isApplicationInProgress: !isChange,
      }),
    )
  }

  return result
}

/** The leaves VMST lists for the applicant, from the durable link map. */
export const childApplicationLinksToExistingChildApplications = (
  links: ChildApplicationLink[],
): ExistingChildApplication[] =>
  links.map((link) => ({
    applicationId: link.vmstApplicationId,
    expectedDateOfBirth: link.expectedDateOfBirth ?? '',
    dateOfBirth: link.dateOfBirth || undefined,
    adoptionDate: link.adoptionDate || undefined,
    isChangeInProgress: false,
  }))

/**
 * Upserts the durable child ↔ VMST link map from the latest VMST parental-leave
 * payload, preserving prior entries VMST momentarily omits and never rekeying
 * an entry once its `childKey` has been assigned.
 */
export const vmstParentalLeavesToChildApplicationLinks = (
  parentalLeaves: Array<{
    applicationId?: string | null
    applicationFundId?: string | null
    expectedDateOfBirth?: string | null
    dateOfBirth?: string | null
    adoptionDate?: string | null
  }> = [],
  previousLinks: ChildApplicationLink[] = [],
): ChildApplicationLink[] => {
  const byVmstId = new Map<string, ChildApplicationLink>(
    previousLinks.map((link) => [link.vmstApplicationId, link]),
  )

  for (const record of parentalLeaves) {
    const {
      applicationId,
      applicationFundId,
      expectedDateOfBirth,
      dateOfBirth,
      adoptionDate,
    } = record

    if (!applicationId) {
      continue
    }

    const existing = byVmstId.get(applicationId)

    byVmstId.set(applicationId, {
      // Once the key is assigned we never rekey it, so DOB drift after link
      // creation cannot break the change flow.
      childKey: existing?.childKey ?? `vmst:${applicationId}`,
      vmstApplicationId: applicationId,
      applicationFundId: applicationFundId ?? existing?.applicationFundId,
      expectedDateOfBirth: expectedDateOfBirth ?? existing?.expectedDateOfBirth,
      dateOfBirth: dateOfBirth ?? existing?.dateOfBirth,
      adoptionDate: adoptionDate ?? existing?.adoptionDate,
    })
  }

  return Array.from(byVmstId.values())
}

export const getChildrenFromMockData = (
  application: Application,
): ChildInformation => {
  const { applicantGenderCode } = getApplicationExternalData(
    application.externalData,
  )
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )

  const parentalRelation = getValueViaPath(
    application.answers,
    'mock.useMockedParentalRelation',
  ) as ChildInformation['parentalRelation']

  const dob = getValueViaPath(
    application.answers,
    'mock.useMockedDateOfBirth',
  ) as string

  const primaryParentNationalRegistryId = getValueViaPath(
    application.answers,
    'mock.useMockedPrimaryParentNationalRegistryId',
  ) as string

  const primaryParentRightsDays = Number(
    getValueViaPath(
      application.answers,
      'mock.useMockedPrimaryParentRights',
    ) as string,
  )

  const secondaryParentRightsDays = Number(
    getValueViaPath(
      application.answers,
      'mock.useMockedSecondaryParentRights',
    ) as string,
  )

  if (!dob) {
    // Only reachable if this is called without the mock answers it reads from.
    // Fail with something that names the problem rather than a TypeError on
    // `undefined.slice`, which says nothing about which answer is missing.
    throw new TemplateApiError(
      parentalLeaveFormMessages.shared.childrenError,
      500,
    )
  }

  const formattedDOB = `${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(
    6,
    8,
  )}`

  const child: ChildInformation =
    parentalRelation === ParentalRelations.primary
      ? {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: ParentalRelations.primary,
          hasRights: primaryParentRightsDays > 0,
          remainingDays: primaryParentRightsDays,
        }
      : {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: ParentalRelations.secondary,
          primaryParentNationalRegistryId,
          hasRights: secondaryParentRightsDays > 0,
          remainingDays: secondaryParentRightsDays,
          primaryParentGenderCode: applicantGenderCode,
          primaryParentTypeOfApplication: noChildrenFoundTypeOfApplication,
        }

  return child
}

/**
 * A child on its way into the children list, with what is known about where it
 * came from.
 */
export interface ChildCandidate {
  child: ChildInformationWithoutRights
  // The leave of the application the child was read from: links it to that
  // leave even if the leave's dates have since moved.
  leaveApplicationId?: string
  // Set for the registered pregnancy: it may be an unborn child already applied
  // for under an earlier due date.
  pregnancyDueDate?: string
}

type LinkOptions = Omit<ChildCandidate, 'child'>

const isInProgressEntry = (existing: ExistingChildApplication) =>
  existing.isChangeInProgress || !!existing.isApplicationInProgress

const describesChild = (
  existing: ExistingChildApplication,
  child: ChildInformationWithoutRights,
  { pregnancyDueDate }: LinkOptions,
) =>
  isSameChild(existing, child) ||
  (!!pregnancyDueDate && isSamePregnancy(pregnancyDueDate, existing))

/**
 * The applicant's leave and unfinished application for this child, if any. A
 * leave is matched on its id when the child came from an application for it,
 * otherwise on the child's dates.
 */
export const findExistingApplicationForChild = (
  existingApplications: ExistingChildApplication[],
  child: ChildInformationWithoutRights,
  options: LinkOptions = {},
): {
  leave?: ExistingChildApplication
  inProgress?: ExistingChildApplication
} => {
  const leaves = existingApplications.filter((e) => !isInProgressEntry(e))
  const leave =
    (options.leaveApplicationId &&
      leaves.find((e) => e.applicationId === options.leaveApplicationId)) ||
    leaves.find((e) => describesChild(e, child, options))
  const inProgress = existingApplications
    .filter(isInProgressEntry)
    .find((e) => describesChild(e, child, options))

  return { leave, inProgress }
}

// Every field this file derives. A child copied from an earlier application's
// snapshot carries the values that were current back then; only the current
// lookup decides. Includes names earlier versions stored.
const DERIVED_FIELDS = [
  'key',
  'vmstApplicationId',
  'inProgressApplicationId',
  'inProgressIsChange',
  'existingApplicationId',
  'existingApplicationHasFundId',
  'existingApplicationIsChangeInProgress',
  'existingApplicationIsInProgress',
]

const withoutDerivedFields = <T extends object>(child: T): T => {
  const result = { ...child } as Record<string, unknown>

  for (const field of DERIVED_FIELDS) {
    delete result[field]
  }

  return result as T
}

/**
 * Links a child to the applicant's leave for it, which makes selecting the child
 * start a change application, and to an unfinished application holding it. A
 * linked leave's dates are VMST's, so they replace the snapshot's.
 */
export const linkChild = <T extends ChildInformationWithoutRights>(
  child: T,
  existingApplications: ExistingChildApplication[],
  options: LinkOptions = {},
): T => {
  const linked = withoutDerivedFields(child)
  const { leave, inProgress } = findExistingApplicationForChild(
    existingApplications,
    linked,
    options,
  )

  if (leave) {
    linked.vmstApplicationId = leave.applicationId
    linked.expectedDateOfBirth =
      toDay(leave.expectedDateOfBirth) || linked.expectedDateOfBirth
    if (toDay(leave.dateOfBirth)) {
      linked.dateOfBirth = toDay(leave.dateOfBirth)
    }
    if (toDay(leave.adoptionDate)) {
      linked.adoptionDate = toDay(leave.adoptionDate)
    }
  }

  if (inProgress) {
    linked.inProgressApplicationId = inProgress.applicationId
    linked.inProgressIsChange = inProgress.isChangeInProgress
  }

  return linked
}

const toCandidate = (
  entry: ChildInformationWithoutRights | ChildCandidate,
): ChildCandidate => ('child' in entry ? entry : { child: entry })

/**
 * Merges children from several sources into one list, dropping duplicates,
 * linking each to the applicant's leave and unfinished application for it, and
 * giving each a stable key.
 *
 * Order matters: earlier sources win, so pass the applicant's own applications
 * first. That keeps the child shaped the way they already answered for it.
 */
export const collectChildren = (
  sources: Array<Array<ChildInformationWithoutRights | ChildCandidate>>,
  existingApplications: ExistingChildApplication[],
): ChildInformationWithoutRights[] => {
  const children: ChildInformationWithoutRights[] = []

  const isAlreadyInList = (
    child: ChildInformationWithoutRights,
    { pregnancyDueDate }: LinkOptions,
  ) =>
    children.some(
      (listed) =>
        isSameChild(listed, child) ||
        (!!child.vmstApplicationId &&
          listed.vmstApplicationId === child.vmstApplicationId) ||
        (!!pregnancyDueDate &&
          listed.parentalRelation === ParentalRelations.primary &&
          isSamePregnancy(pregnancyDueDate, listed)),
    )

  for (const source of sources) {
    for (const { child, ...options } of source.map(toCandidate)) {
      const linked = linkChild(child, existingApplications, options)

      // Dedupe covers the otherParent multipleBirths case, and matters more now
      // that a child can reach this list from several sources at once.
      if (isAlreadyInList(linked, options)) {
        continue
      }

      children.push(linked)
    }
  }

  return assignChildKeys(children)
}

/**
 * A secondary parent's own earlier application recorded what the primary parent
 * had transferred and requested back then. The primary parent's current
 * application is what holds now.
 */
const refreshFromPrimaryParent = (
  child: ChildInformationWithoutRights,
  fromPrimaryParents: ChildInformationWithoutRights[],
): ChildInformationWithoutRights => {
  if (child.parentalRelation !== ParentalRelations.secondary) {
    return child
  }

  const current = fromPrimaryParents.find((candidate) =>
    isSameChild(candidate, child),
  )

  if (current?.parentalRelation !== ParentalRelations.secondary) {
    return child
  }

  return {
    ...child,
    transferredDays: current.transferredDays,
    multipleBirthsDays: current.multipleBirthsDays,
    primaryParentNationalRegistryId: current.primaryParentNationalRegistryId,
    primaryParentGenderCode: current.primaryParentGenderCode,
    primaryParentTypeOfApplication: current.primaryParentTypeOfApplication,
  }
}

/**
 * @param vmstLeaves The leaves VMST lists for the applicant, or `null` when
 * that list could not be fetched; the applicant's own applications stand in.
 */
export const getChildren = (
  applicationsWhereApplicant: Application[],
  applicationsWhereOtherParent: Application[],
  pregnancyStatus?: PregnancyStatus | null,
  vmstLeaves: ExistingChildApplication[] | null = null,
  childApplicationLinks: ChildApplicationLink[] = [],
): {
  children: ChildInformationWithoutRights[]
  existingApplications: ExistingChildApplication[]
  childApplicationLinks: ChildApplicationLink[]
} => {
  const ownApplications = sortApplicationsByRelevance(
    applicationsWhereApplicant,
  )
  const primaryParentApplications = sortApplicationsByRelevance(
    applicationsWhereOtherParent,
  )

  const existingApplications = [
    ...applicationsToInProgressChildApplications(ownApplications),
    ...(vmstLeaves ?? applicationsToExistingChildApplication(ownApplications)),
  ]

  const fromPrimaryParents = applicationsToChildInformation(
    primaryParentApplications,
    true,
  )

  // The applicant's own earlier applications come first: one application is
  // one action, so a child they already applied for stays selectable and
  // picking it starts a change application. Nothing else produces this child
  // once it is born — the other-parent list only covers children someone else
  // applied for, and pregnancy status goes false after birth.
  const fromOwnApplications = ownApplications.flatMap(
    (application): ChildCandidate[] => {
      const child = applicationToChildInformation(application, false)

      return child
        ? [
            {
              child: refreshFromPrimaryParent(child, fromPrimaryParents),
              leaveApplicationId: getLeaveApplicationId(application),
            },
          ]
        : []
    },
  )

  // TODO: revisit this when we include twins in application
  // Noted: Have not seen multipleBirths pregnancy status yet
  // primary parents get pregnancy status before due date and it returns 1 expected date
  // If she started the application after child/chilren is/are born then pregnancy status is false
  const fromPregnancy: ChildCandidate[] = pregnancyStatus?.hasActivePregnancy
    ? [
        {
          child: {
            expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
            parentalRelation: ParentalRelations.primary,
          },
          pregnancyDueDate: pregnancyStatus.isSimulated
            ? undefined
            : pregnancyStatus.expectedDateOfBirth,
        },
      ]
    : []

  const children = collectChildren(
    [fromOwnApplications, fromPrimaryParents, fromPregnancy],
    existingApplications,
  )

  return { children, existingApplications, childApplicationLinks }
}
