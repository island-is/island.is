import { EmploymentStatus, WorkingAbility } from '../shared'
import { employment as employmentMessages } from '../lib/messages'
import { FormText } from '@island.is/application/types'

export const getCurrentSituationString = (
  status: EmploymentStatus,
): FormText => {
  const statusMap: Record<EmploymentStatus, FormText> = {
    [EmploymentStatus.UNEMPLOYED]:
      employmentMessages.currentSituation.labels.statusOptionNoJob,
    [EmploymentStatus.EMPLOYED]:
      employmentMessages.currentSituation.labels.statusCurrentlyEmployed,
    [EmploymentStatus.PARTJOB]:
      employmentMessages.currentSituation.labels.statusPartJob,
    [EmploymentStatus.OCCASIONAL]:
      employmentMessages.currentSituation.labels.statusOccasionalJob,
  }

  return statusMap[status]
}

export const getWorkingAbilityString = (status: WorkingAbility): FormText => {
  const statusMap: Record<WorkingAbility, FormText> = {
    [WorkingAbility.ABLE]:
      employmentMessages.workingAbility.labels.optionFullTime,
    [WorkingAbility.DISABILITY]:
      employmentMessages.workingAbility.labels.optionDisability,
    [WorkingAbility.PARTLY_ABLE]:
      employmentMessages.workingAbility.labels.optionPartTime,
  }

  return statusMap[status]
}
