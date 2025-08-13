import { getValueViaPath } from '@island.is/application/core'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'
import { FormValue } from '@island.is/application/types'
import { RepeaterOption } from '../shared/types'

export const filterWorkMachineOptions = (
  options: RepeaterOption[],
  answers: FormValue,
  index: number,
): RepeaterOption[] => {
  const validWorkMachines: string[] = []
  const assigneeInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
  >(answers, 'assigneeInformation')
  assigneeInformation?.forEach((item, i) => {
    if (
      i !== index &&
      item.workMachine?.some((machine) =>
        options.some((option) => option.value === machine),
      )
    ) {
      validWorkMachines.push(
        ...(item.workMachine?.filter((machine) =>
          options.some((option) => option.value === machine),
        ) ?? []),
      )
    }
  })
  return options.filter((x) => !validWorkMachines.includes(x.value))
}
