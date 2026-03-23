import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export * from './isValidPhoneNumber'
export * from './getApplicantInformation'
export * from './getAssigneeInformation'
export * from './isValidEmail'
export * from './isContractor'
export * from './formatDate'
export * from './isSameAsApplicant'
export * from './certificateOfTenureAlertMessageConditions'
export * from './isRejected'
export * from './setOnMachineNumberChange'
export * from './getReviewers'

export const getMissingWorkMachines = (answers: FormValue) => {
  const allWorkMachines = (
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
    >(answers, 'certificateOfTenure') || []
  )
    .filter((x) => !x?.isContractor?.includes('yes'))
    .map((x) => x.machineNumber)

  const assigneeInformation =
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') || []

  const selectedWorkMachines = [] as string[]
  for (const item of assigneeInformation) {
    if (item.workMachine) {
      for (const machine of item.workMachine) {
        selectedWorkMachines.push(machine.split(' ')[0])
      }
    }
  }

  const missingWorkMachines = allWorkMachines.filter(
    (machine) => !selectedWorkMachines.includes(machine),
  )

  return missingWorkMachines
}

export const getInvalidWorkMachines = (answers: FormValue) => {
  const allWorkMachines = (
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
    >(answers, 'certificateOfTenure') || []
  ).map((x) => x.machineNumber)

  const assigneeInformation =
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') || []

  const selectedWorkMachines = []
  for (const item of assigneeInformation) {
    if (item.workMachine) {
      for (const machine of item.workMachine) {
        selectedWorkMachines.push(machine.split(' ')[0])
      }
    }
  }

  const invalidWorkMachines = selectedWorkMachines.filter(
    (machine) => !allWorkMachines.includes(machine),
  )

  return invalidWorkMachines
}
