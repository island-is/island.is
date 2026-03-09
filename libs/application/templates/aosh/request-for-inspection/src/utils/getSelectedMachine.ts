import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  MachineDto,
  MachinesWithTotalCount,
} from '@island.is/clients/work-machines'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
  id?: string,
) => {
  if (getValueViaPath<boolean | undefined>(answers, 'machine.findVehicle')) {
    const machine = getValueViaPath<MachineDto>(answers, 'machine')
    return machine
  }

  const machineId = id ? id : getValueViaPath<string>(answers, 'machine.id', '')
  const machinesWithTotal = getValueViaPath<MachinesWithTotalCount>(
    externalData,
    'machinesList.data',
    undefined,
  )

  return machinesWithTotal?.machines.find((machine) => machine.id === machineId)
}
