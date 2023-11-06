import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const currentMachineList =
    (externalData?.machinesList?.data as Machine[]) || []
  const machineValue = getValueViaPath(answers, 'machine', '') as string
  return currentMachineList[parseInt(machineValue, 10)]
}
