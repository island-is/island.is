import get from 'lodash/get'

import { Application } from '@island.is/application/core'

import {
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  ChildrenAndExistingApplications,
} from './types'

const applicationToChildInformation = (
  application: Application,
): ChildInformation | null => {
  const selectedChildIndex = get(application, 'answers.selectedChild')
  const selectedChild = get(
    application,
    `externalData.children.data.children[${selectedChildIndex}]`,
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

export const getChildrenAndExistingApplications = (
  applicationsWhereApplicant: Application[],
  applicationsWhereOtherParent: Application[],
  pregnancyStatus?: PregnancyStatus,
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
    const isAlreadyInList =
      children.find(
        (currentChild) =>
          currentChild.expectedDateOfBirth === child.expectedDateOfBirth,
      ) !== undefined

    if (!isAlreadyInList) {
      children.push(child)
    }
  }

  if (pregnancyStatus?.hasActivePregnancy) {
    children.push({
      expectedDateOfBirth: pregnancyStatus.expectedDateOfBirth,
      parentalRelation: 'primary',
    })
  }

  return {
    children,
    existingApplications,
  }
}
