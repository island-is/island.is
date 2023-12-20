import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared/types'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const machineId = getValueViaPath(answers, 'pickMachine.id', '') as Machine
  console.log('machineId', machineId)
  console.log('externalData', externalData)
  console.log('answers', answers)
  const machines = getValueViaPath(
    externalData,
    'machinesList.data',
    [],
  ) as Machine[]
  return machines.find((machine) => machine.id === machineId)
}
