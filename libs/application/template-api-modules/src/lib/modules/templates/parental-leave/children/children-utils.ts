import { getValueViaPath, NO } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { DistributiveOmit } from '@island.is/shared/types'

import {
  ParentalRelations,
  States,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getSelectedChild,
  getTransferredDays,
  ChildApplicationLink,
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  getApplicationAnswers,
  getApplicationExternalData,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave'
import { TemplateApiError } from '@island.is/nest/problem'

// Change-flow states where the applicant still has unfinished business with the
// existing application; picking the same child again should re-open it.
const CHANGE_IN_PROGRESS_STATES: readonly string[] = [
  States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
  States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
  States.EMPLOYER_APPROVE_EDITS,
  States.EMPLOYER_EDITS_ACTION,
  States.VINNUMALASTOFNUN_APPROVE_EDITS,
  States.VINNUMALASTOFNUN_EDITS_ACTION,
]

// We do not require hasRights or remainingDays in this step
// as it will be calculated later in the process
type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

export const applicationsToChildInformation = (
  applications: Application[],
  asOtherParent = false,
): ChildInformationWithoutRights[] => {
  const result: ChildInformationWithoutRights[] = []

  for (const application of applications) {
    const { applicantGenderCode } = getApplicationExternalData(
      application.externalData,
    )
    const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
      application.answers,
    )

    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (selectedChild === null) {
      continue
    }

    const { otherParentRightOfAccess } = getApplicationAnswers(
      application.answers,
    )

    if (asOtherParent) {
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
        result.push({
          parentalRelation: ParentalRelations.secondary,
          expectedDateOfBirth: 'N/A',
          primaryParentNationalRegistryId: 'N/A',
        })
      } else if (selectedChild.parentalRelation === ParentalRelations.primary) {
        result.push({
          parentalRelation: ParentalRelations.secondary,
          expectedDateOfBirth: selectedChild.expectedDateOfBirth,
          primaryParentNationalRegistryId: application.applicant,
          transferredDays,
          multipleBirthsDays: maxMultipleBirthDays - multipleBirthsRequestDays,
          primaryParentGenderCode: applicantGenderCode,
          primaryParentTypeOfApplication: noChildrenFoundTypeOfApplication,
          adoptionDate: selectedChild.adoptionDate,
          dateOfBirth: selectedChild.dateOfBirth,
        })
      } else {
        result.push({
          parentalRelation: ParentalRelations.primary,
          expectedDateOfBirth: selectedChild.expectedDateOfBirth,
          transferredDays,
        })
      }
    } else {
      result.push(selectedChild)
    }
  }

  return result
}

export const applicationsToExistingChildApplication = (
  applications: Application[],
): ExistingChildApplication[] => {
  const result: ExistingChildApplication[] = []
  for (const application of applications) {
    const childInformation = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (childInformation !== null) {
      const { applicationFundId } = getApplicationExternalData(
        application.externalData,
      )
      result.push({
        applicationId: application.id,
        expectedDateOfBirth: childInformation.expectedDateOfBirth,
        adoptionDate: childInformation.adoptionDate,
        hasApplicationFundId: !!applicationFundId,
        isChangeInProgress: CHANGE_IN_PROGRESS_STATES.includes(
          application.state,
        ),
      })
    }
  }

  return result
}

export const vmstParentalLeavesToExistingChildApplications = (
  parentalLeaves: Array<{
    applicationId?: string
    applicationFundId?: string
    expectedDateOfBirth?: string
    adoptionDate?: string
  }> = [],
): ExistingChildApplication[] =>
  parentalLeaves
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

/**
 * Upserts the durable child ↔ VMST link map from the latest VMST parental-leave
 * payload, preserving prior entries VMST momentarily omits and never rekeying
 * an entry once its `childKey` has been assigned.
 */
export const vmstParentalLeavesToChildApplicationLinks = (
  parentalLeaves: Array<{
    applicationId?: string
    applicationFundId?: string
    expectedDateOfBirth?: string
    dateOfBirth?: string
    adoptionDate?: string
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
 * The applicant's own application for this child, if any. VMST has no shared key
 * for a child, so a child is matched on expected date of birth or, for foster
 * care and adoption, on adoption date. A change already in flight wins so that
 * selecting the child re-opens it instead of starting a second change alongside
 * it.
 */
export const findExistingApplicationForChild = (
  existingApplications: ExistingChildApplication[],
  child: { expectedDateOfBirth?: string; adoptionDate?: string },
): ExistingChildApplication | undefined => {
  const matches = existingApplications.filter(
    (existing) =>
      (!!child.expectedDateOfBirth &&
        existing.expectedDateOfBirth === child.expectedDateOfBirth) ||
      (!!child.adoptionDate && existing.adoptionDate === child.adoptionDate),
  )

  return matches.find((match) => match.isChangeInProgress) ?? matches[0]
}

/**
 * Links a child to the applicant's existing application for it, if there is one.
 * `existingApplicationId` is what makes selecting the child start a change
 * application rather than a second first-time application.
 */
export const withExistingApplicationId = <
  T extends { expectedDateOfBirth?: string; adoptionDate?: string },
>(
  child: T,
  existingApplications: ExistingChildApplication[],
): T => {
  const existing = findExistingApplicationForChild(existingApplications, child)

  return existing
    ? {
        ...child,
        existingApplicationId: existing.applicationId,
        existingApplicationHasFundId: existing.hasApplicationFundId,
        existingApplicationIsChangeInProgress: existing.isChangeInProgress,
      }
    : child
}

/**
 * Merges children from several sources into one list, dropping duplicates and
 * linking each to the applicant's existing application for it.
 *
 * Order matters: earlier sources win, so pass the applicant's own applications
 * first. That keeps the child shaped the way they already answered for it, and
 * makes the change link the one that survives deduplication.
 */
export const collectChildren = (
  sources: ChildInformationWithoutRights[][],
  existingApplications: ExistingChildApplication[],
): ChildInformationWithoutRights[] => {
  const children: ChildInformationWithoutRights[] = []

  const isAlreadyInList = (child: ChildInformationWithoutRights) =>
    children.some(
      (listed) =>
        (!!child.expectedDateOfBirth &&
          listed.expectedDateOfBirth === child.expectedDateOfBirth) ||
        (!!child.adoptionDate && listed.adoptionDate === child.adoptionDate),
    )

  for (const source of sources) {
    for (const child of source) {
      // Dedupe covers the otherParent multipleBirths case, and matters more now
      // that a child can reach this list from several sources at once.
      if (isAlreadyInList(child)) {
        continue
      }

      children.push(withExistingApplicationId(child, existingApplications))
    }
  }

  return children
}

export const getChildren = (
  applicationsWhereApplicant: Application[],
  applicationsWhereOtherParent: Application[],
  pregnancyStatus?: PregnancyStatus | null,
  vmstExistingApplications: ExistingChildApplication[] = [],
  childApplicationLinks: ChildApplicationLink[] = [],
): {
  children: ChildInformationWithoutRights[]
  existingApplications: ExistingChildApplication[]
  childApplicationLinks: ChildApplicationLink[]
} => {
  const existingApplications =
    vmstExistingApplications.length > 0
      ? vmstExistingApplications
      : applicationsToExistingChildApplication(applicationsWhereApplicant)

  const children = collectChildren(
    [
      // The applicant's own earlier applications come first: one application is
      // one action, so a child they already applied for stays selectable and
      // picking it starts a change application. Nothing else produces this child
      // once it is born — the other-parent list only covers children someone else
      // applied for, and pregnancy status goes false after birth.
      applicationsToChildInformation(applicationsWhereApplicant),
      applicationsToChildInformation(applicationsWhereOtherParent, true),
      // TODO: revisit this when we include twins in application
      // Noted: Have not seen multipleBirths pregnancy status yet
      // primary parents get pregnancy status before due date and it returns 1 expected date
      // If she started the application after child/chilren is/are born then pregnancy status is false
      pregnancyStatus?.hasActivePregnancy
        ? [
            {
              expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
              parentalRelation: ParentalRelations.primary,
            } as ChildInformationWithoutRights,
          ]
        : [],
    ],
    existingApplications,
  )

  return { children, existingApplications, childApplicationLinks }
}
