import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  MachineDto,
  MachinesWithTotalCount,
} from '@island.is/clients/work-machines'
import { cp } from 'fs'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
  id?: string,
) => {
  if (getValueViaPath<boolean | undefined>(answers, 'machine.findVehicle')) {
    const machine = getValueViaPath(answers, 'machine') as MachineDto
    return machine
  }

  const machineId = id
    ? id
    : (getValueViaPath(answers, 'machine.id', '') as MachineDto)
  const machinesWithTotal = getValueViaPath(
    externalData,
    'machinesList.data',
    {},
  ) as MachinesWithTotalCount

  return machinesWithTotal.machines.find((machine) => machine.id === machineId)
}
