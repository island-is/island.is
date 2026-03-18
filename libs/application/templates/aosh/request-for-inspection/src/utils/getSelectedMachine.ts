import { MachineDetails } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  MachinesWithTotalCount,
  MachineForInspectionDto,
} from '@island.is/clients/work-machines'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
  id?: string,
): MachineForInspectionDto | undefined => {
  if (getValueViaPath<boolean | undefined>(answers, 'machine.findVehicle')) {
    const machine = getValueViaPath<MachineDetails>(answers, 'machine')
    return {
      ...machine,
      owner: { number: machine?.ownerNumber || '', name: '' },
      licensePlateNumber: machine?.plate || '',
    }
  }

  const machineId = id ? id : getValueViaPath<string>(answers, 'machine.id', '')
  const machinesWithTotal = getValueViaPath<MachinesWithTotalCount>(
    externalData,
    'machinesList.data',
    undefined,
  )

  return machinesWithTotal?.machines.find((machine) => machine.id === machineId)
}
