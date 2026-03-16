import { MachineDetails } from '@island.is/api/schema'
import { MachineForInspectionDto } from '@island.is/clients/work-machines'

export const formatMachineInformation: (
  machine: MachineForInspectionDto,
) => MachineDetails | null = (machine: MachineForInspectionDto) => {
  if (!machine) return null

  return {
    id: machine.id || '',
    type: machine.type,
    regNumber: machine.registrationNumber,
    subType: machine.subType || '',
    category: machine.category,
    status: machine.status,
    plate: machine.licensePlateNumber,
    disabled: machine.disabled,
    supervisorName: machine.supervisor,
    ownerNumber: machine.owner?.number,
    errorMessage: machine.errorMessage,
    __typename: 'MachineDetails',
  }
}
