import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared/types'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const machineId = getValueViaPath(answers, 'pickMachine.id', '') as Machine
  const machines = getValueViaPath(
    externalData,
    'machinesList.data',
    {},
  ) as MachinesWithTotalCount
  return machines.machines.find((machine) => machine.id === machineId)
}

export const mustInspectBeforeStreetRegistration = (
  externalData: ExternalData,
  regNumber: string,
) => {
  const inspectBeforeTypes = getValueViaPath(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  ) as string[]
  console.log('inspectBeforeTypes', inspectBeforeTypes)
  return inspectBeforeTypes?.includes(regNumber.substring(0, 2)) || false
}
