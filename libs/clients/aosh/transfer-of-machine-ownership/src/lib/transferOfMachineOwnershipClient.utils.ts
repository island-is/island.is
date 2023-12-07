import {
  ApiMachineOwnerChangePutRequest,
  MachineOwnerChangeCompleteDto,
  ApiMachineOwnerChangePostRequest,
  MachineOwnerChangeCreateDto,
  ApiMachineSupervisorChangePostRequest,
  MachineSupervisorChangeDto,
} from '../../gen/fetch'
import {
  ConfirmOwnerChange,
  ChangeMachineOwner,
  ChangeMachineSupervisor,
} from './transferOfMachineOwnershipClient.types'

export const confirmChangeToApiRequest = (
  confirmChange: ConfirmOwnerChange,
  currentPersonsNationalId: string,
): ApiMachineOwnerChangePutRequest => {
  const machineOwnerChangeCompleteDto: MachineOwnerChangeCompleteDto = {
    id: confirmChange.applicationId,
    machineId: confirmChange.machineId,
    buyerNationalId: confirmChange.buyerNationalId,
    delegateNationalId:
      currentPersonsNationalId || confirmChange.delegateNationalId,
    supervisorNationalId: confirmChange.supervisorNationalId,
    supervisorEmail: confirmChange.supervisorEmail,
    supervisorPhoneNumber: confirmChange.supervisorPhoneNumber,
    machineAddress: confirmChange.machineAddress,
    machineMoreInfo: confirmChange.machineMoreInfo,
    machinePostalCode: confirmChange.machinePostalCode,
  }

  return { machineOwnerChangeCompleteDto }
}

export const apiChangeMachineOwnerToApiRequest = (
  changeMachineOwner: ChangeMachineOwner,
): ApiMachineOwnerChangePostRequest => {
  const machineOwnerChangeCreateDto: MachineOwnerChangeCreateDto = {
    id: changeMachineOwner.applicationId,
    machineId: changeMachineOwner.machineId,
    buyerNationalId: changeMachineOwner.buyerNationalId,
    delegateNationalId: changeMachineOwner.delegateNationalId,
    sellerNationalId: changeMachineOwner.sellerNationalId,
    dateOfOwnerChange: changeMachineOwner.dateOfOwnerChange,
    paymentId: changeMachineOwner.paymentId,
    gsm: changeMachineOwner.phoneNumber,
    emails: changeMachineOwner.email,
  }

  return { machineOwnerChangeCreateDto }
}

export const apiChangeMachineSupervisorToApiRequest = (
  changeMachineSupervisor: ChangeMachineSupervisor,
): ApiMachineSupervisorChangePostRequest => {
  const machineSupervisorChangeDto: MachineSupervisorChangeDto = {
    machineId: changeMachineSupervisor.machineId || undefined,
    delegateNationalId: changeMachineSupervisor.delegateNationalId || null,
    ownerNationalId: changeMachineSupervisor.ownerNationalId || null,
    supervisorNationalId: changeMachineSupervisor.supervisorNationalId || null,
    email: changeMachineSupervisor.email || null,
    phoneNumber: changeMachineSupervisor.phoneNumber || null,
    address: changeMachineSupervisor.address || null,
    postalCode: changeMachineSupervisor.postalCode || null,
    moreInfo: changeMachineSupervisor.moreInfo || null,
  }
  return { machineSupervisorChangeDto }
}
