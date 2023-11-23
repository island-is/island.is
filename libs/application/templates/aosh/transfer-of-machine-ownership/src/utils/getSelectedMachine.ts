import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared/types'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const machineValue = getValueViaPath(answers, 'machine', '') as Machine
  return machineValue
}
