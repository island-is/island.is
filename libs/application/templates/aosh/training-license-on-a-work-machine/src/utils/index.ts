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

export const getMissingWorkMachines = (answers: FormValue) => {
  const allWorkMachines = (
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
    >(answers, 'certificateOfTenure') || []
  )
    .filter((x) => !x?.isContractor?.includes('yes'))
    .map((x) => x.machineNumber)

  const selectedWorkMachines = (
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') || []
  ).flatMap((x) => x.workMachine?.map((x) => x.split(' ')[0]))

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

  const selectedWorkMachines = (
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') || []
  ).flatMap((x) => x.workMachine?.map((x) => x.split(' ')[0]))

  const invalidWorkMachines = selectedWorkMachines.filter(
    (machine) => !allWorkMachines.includes(machine),
  )

  return invalidWorkMachines
}
