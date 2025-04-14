import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TrainingLicenseOnAWorkMachineAnswers } from '../shared/types'

export const isLastApprovee = (answers: FormValue) => {
  const approved = getValueViaPath<string[]>(answers, 'approved') ?? []
  const assigneeInformation =
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') ?? []
  return approved.length === assigneeInformation.length - 1
}
