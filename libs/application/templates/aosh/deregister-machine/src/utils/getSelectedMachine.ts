import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared/types'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  if (getValueViaPath<boolean | undefined>(answers, 'machine.findVehicle')) {
    const machine = getValueViaPath(answers, 'machine') as Machine
    return machine
  }

  const machineId = getValueViaPath(answers, 'machine.id', '') as Machine
  const machinesWithTotal = getValueViaPath(
    externalData,
    'machinesList.data',
    {},
  ) as MachinesWithTotalCount

  return machinesWithTotal.machines.find((machine) => machine.id === machineId)
}
