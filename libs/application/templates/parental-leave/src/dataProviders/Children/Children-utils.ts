import { Application, getValueViaPath } from '@island.is/application/core'

import {
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  ChildrenAndExistingApplications,
} from './types'

const applicationToChildInformation = (
  application: Application,
): ChildInformation | null => {
  const selectedChildIndex = getValueViaPath(
    application.answers,
    'selectedChild',
  )
  const selectedChild = getValueViaPath(
    application.externalData,
    `children.data.childrenAndExistingApplications.children[${selectedChildIndex}]`,
    null,
  ) as ChildInformation | null

  return selectedChild
}

export const applicationsToChildInformation = (
  applications: Application[],
  asOtherParent = false,
): ChildInformation[] => {
  const result: ChildInformation[] = []

  for (const application of applications) {
    const selectedChild = applicationToChildInformation(application)

    if (selectedChild !== null) {
      if (asOtherParent) {
        if (selectedChild.parentalRelation === 'primary') {
          result.push({
            parentalRelation: 'secondary',
            expectedDateOfBirth: selectedChild.expectedDateOfBirth,
            primaryParentNationalRegistryId: application.applicant,
          })
        } else {
          result.push({
            parentalRelation: 'primary',
            expectedDateOfBirth: selectedChild.expectedDateOfBirth,
          })
        }
      } else {
        result.push(selectedChild)
      }
    }
  }

  return result
}

export const applicationsToExistingChildApplication = (
  applications: Application[],
): ExistingChildApplication[] => {
  const result: ExistingChildApplication[] = []

  for (const application of applications) {
    const childInformation = applicationToChildInformation(application)

    if (childInformation !== null) {
      result.push({
        applicationId: application.id,
        expectedDateOfBirth: childInformation.expectedDateOfBirth,
      })
    }
  }

  return result
}

export const getChildrenFromMockData = (
  application: Application,
): ChildrenAndExistingApplications => {
  const parentalRelation = getValueViaPath(
    application.answers,
    'useMockedParentalRelation',
  ) as ChildInformation['parentalRelation']
  const dob = getValueViaPath(
    application.answers,
    'useMockedDateOfBirth',
  ) as string
  const primaryParentNationalRegistryId = getValueViaPath(
    application.answers,
    'useMockedPrimaryParentNationalRegistryId',
  ) as string

  const formattedDOB = `${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(
    6,
    8,
  )}`

  const child: ChildInformation =
    parentalRelation === 'primary'
      ? {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: 'primary',
        }
      : {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: 'secondary',
          primaryParentNationalRegistryId,
        }

  return {
    children: [child],
    existingApplications: [],
  }
}

export const getChildrenAndExistingApplications = (
  applicationsWhereApplicant: Application[],
  applicationsWhereOtherParent: Application[],
  pregnancyStatus?: PregnancyStatus | null,
): ChildrenAndExistingApplications => {
  const existingApplications = applicationsToExistingChildApplication(
    applicationsWhereApplicant,
  )
  const childrenWhereOtherParent = applicationsToChildInformation(
    applicationsWhereOtherParent,
    true,
  )

  const children: ChildInformation[] = []

  for (const child of childrenWhereOtherParent) {
    const isAlreadyInList = children.some(
      (currentChild) =>
        currentChild.expectedDateOfBirth === child.expectedDateOfBirth,
    )

    if (!isAlreadyInList) {
      children.push(child)
    }
  }

  if (pregnancyStatus?.hasActivePregnancy) {
    const hasAlreadyAppliedForChild = existingApplications.some(
      ({ expectedDateOfBirth }) =>
        expectedDateOfBirth === pregnancyStatus.expectedDateOfBirth,
    )

    // TODO: revisit this when we include twins in application
    if (!hasAlreadyAppliedForChild) {
      children.push({
        expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
        parentalRelation: 'primary',
      })
    }
  }

  return {
    children,
    existingApplications,
  }
}
