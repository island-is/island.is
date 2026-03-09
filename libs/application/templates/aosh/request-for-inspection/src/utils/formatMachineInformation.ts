import { MachineDetails, WorkMachine } from '@island.is/api/schema'

export const formatMachineInformation: (
  machine: WorkMachine,
) => MachineDetails | null = (machine: WorkMachine) => {
  if (!machine) return null

  return {
    id: machine.id,
    type: machine.type,
    regNumber: machine.registrationNumber,
    subType: machine.subType || '',
    category: machine.category,
    status: machine.status,
    plate: machine.licensePlateNumber,
    disabled: machine.errorMessage ? true : false,
    ownerName: machine.owner?.name,
    supervisorName: machine.supervisor?.name,
    errorMessage: machine.errorMessage,
    __typename: 'MachineDetails',
  }
}
