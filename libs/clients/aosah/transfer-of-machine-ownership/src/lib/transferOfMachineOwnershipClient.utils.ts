import {
  ApiMachineOwnerChangePutRequest,
  MachineOwnerChangeCompleteDto,
  ApiMachineOwnerChangePostRequest,
  MachineOwnerChangeCreateDto,
  ApiMachineSupervisorChangePostRequest,
  SupervisorUpdateDto,
} from '../../gen/fetch'
import {
  ConfirmOwnerChange,
  ChangeMachineOwner,
  ChangeMachineSupervisor,
} from './transferOfMachineOwnershipClient.types'

export const confirmChangeToApiRequest = (
  confirmChange: ConfirmOwnerChange,
): ApiMachineOwnerChangePutRequest => {
  const machineOwnerChangeCompleteDto: MachineOwnerChangeCompleteDto = {
    id: confirmChange.id || undefined,
    machineId: confirmChange.machineId || undefined,
  }

  return { machineOwnerChangeCompleteDto }
}

export const apiChangeMachineOwnerToApiRequest = (
  changeMachineOwner: ChangeMachineOwner,
): ApiMachineOwnerChangePostRequest => {
  const machineOwnerChangeCreateDto: MachineOwnerChangeCreateDto = {
    id: changeMachineOwner.id || undefined,
    machineId: changeMachineOwner.machineId || undefined,
    buyerNationalId: changeMachineOwner.buyerNationalId || null,
    delegateNationalId: changeMachineOwner.delegateNationalId || null,
    sellerNationalId: changeMachineOwner.sellerNationalId || null,
    dateOfOwnerChange: changeMachineOwner.dateOfOwnerChange || undefined,
    paymentId: changeMachineOwner.paymentId || null,
    gsm: changeMachineOwner.phoneNumber || null,
    emails: changeMachineOwner.email || null,
  }

  return { machineOwnerChangeCreateDto }
}

export const apiChangeMachineSupervisorToApiRequest = (
  changeMachineSupervisor: ChangeMachineSupervisor,
): ApiMachineSupervisorChangePostRequest => {
  const supervisorUpdateDto: SupervisorUpdateDto = {
    machineId: changeMachineSupervisor.machineId || undefined,
    delegateNationalId: changeMachineSupervisor.delegateNationalId || null,
    ownerNationalId: changeMachineSupervisor.ownerNationalId || null,
    supervisorNationalId: changeMachineSupervisor.supervisorNationalId || null,
    phoneNumber: changeMachineSupervisor.phoneNumber || null,
    email: changeMachineSupervisor.email || null,
    machineLocation: changeMachineSupervisor.machineLocation || null,
  }

  return { supervisorUpdateDto }
}
