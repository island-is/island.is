import { getValueViaPath, NO } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { DistributiveOmit } from '@island.is/shared/types'

import {
  ParentalRelations,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getSelectedChild,
  getTransferredDays,
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'

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
      result.push({
        applicationId: application.id,
        expectedDateOfBirth: childInformation.expectedDateOfBirth,
        adoptionDate: childInformation.adoptionDate,
      })
    }
  }

  return result
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

export const getChildren = (
  applicationsWhereApplicant: Application[],
  applicationsWhereOtherParent: Application[],
  pregnancyStatus?: PregnancyStatus | null,
): ChildInformationWithoutRights[] => {
  const existingApplications = applicationsToExistingChildApplication(
    applicationsWhereApplicant,
  )

  const childrenWhereOtherParent = applicationsToChildInformation(
    applicationsWhereOtherParent,
    true,
  )

  const children: ChildInformationWithoutRights[] = []

  for (const child of childrenWhereOtherParent) {
    const isAlreadyInList =
      children.some(({ expectedDateOfBirth }) => {
        if (expectedDateOfBirth) {
          return expectedDateOfBirth === child.expectedDateOfBirth
        }
        return false
      }) ||
      children.some(({ adoptionDate }) => {
        if (adoptionDate) {
          return adoptionDate === child.adoptionDate
        }
        return false
      })

    const hasAlreadyAppliedForChild =
      existingApplications.some(({ expectedDateOfBirth }) => {
        if (expectedDateOfBirth) {
          return expectedDateOfBirth === child.expectedDateOfBirth
        }
        return false
      }) ||
      existingApplications.some(({ adoptionDate }) => {
        if (adoptionDate) {
          return adoptionDate === child.adoptionDate
        }
        return false
      })

    // This supports to cover otherParent multipleBirths case
    if (!isAlreadyInList && !hasAlreadyAppliedForChild) {
      children.push(child)
    }
  }

  if (pregnancyStatus?.hasActivePregnancy) {
    const hasAlreadyAppliedForChild = existingApplications.some(
      ({ expectedDateOfBirth }) =>
        expectedDateOfBirth === pregnancyStatus.expectedDateOfBirth,
    )

    // TODO: revisit this when we include twins in application
    // Noted: Have not seen multipleBirths pregnancy status yet
    // primary parents get pregnancy status before due date and it returns 1 expected date
    // If she started the application after child/chilren is/are born then pregnancy status is false
    if (!hasAlreadyAppliedForChild) {
      children.push({
        expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
        parentalRelation: ParentalRelations.primary,
      })
    }
  }

  return children
}
