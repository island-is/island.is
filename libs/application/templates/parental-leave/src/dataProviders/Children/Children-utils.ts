import { Application, getValueViaPath } from '@island.is/application/core'
import type { DistributiveOmit } from '@island.is/shared/types'

import {
  getSelectedChild,
  getTransferredDays,
} from '../../lib/parentalLeaveUtils'
import {
  ChildInformation,
  ExistingChildApplication,
  PregnancyStatus,
  ChildrenAndExistingApplications,
  ChildrenWithoutRightsAndExistingApplications,
} from './types'

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
    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (selectedChild !== null) {
      if (asOtherParent) {
        let transferredDays = getTransferredDays(application, selectedChild)

        if (transferredDays !== undefined && transferredDays !== 0) {
          // * -1 because we need to reverse the days over to this parent
          // for example if other parent is requesting 45 days
          // then this parent needs to lose 45 days
          transferredDays *= -1
        }

        if (selectedChild.parentalRelation === 'primary') {
          result.push({
            parentalRelation: 'secondary',
            expectedDateOfBirth: selectedChild.expectedDateOfBirth,
            primaryParentNationalRegistryId: application.applicant,
            transferredDays,
          })
        } else {
          result.push({
            parentalRelation: 'primary',
            expectedDateOfBirth: selectedChild.expectedDateOfBirth,
            transferredDays,
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
    const childInformation = getSelectedChild(
      application.answers,
      application.externalData,
    )

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

  // TODO: Be able to configure rights when mocking
  const child: ChildInformation =
    parentalRelation === 'primary'
      ? {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: 'primary',
          // Hardcode rights when mocking data for now
          hasRights: true,
          remainingDays: 180,
        }
      : {
          expectedDateOfBirth: formattedDOB,
          parentalRelation: 'secondary',
          primaryParentNationalRegistryId,
          // Hardcode rights when mocking data for now
          hasRights: true,
          remainingDays: 180,
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
): ChildrenWithoutRightsAndExistingApplications => {
  const existingApplications = applicationsToExistingChildApplication(
    applicationsWhereApplicant,
  )
  const childrenWhereOtherParent = applicationsToChildInformation(
    applicationsWhereOtherParent,
    true,
  )

  const children: ChildInformationWithoutRights[] = []

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
