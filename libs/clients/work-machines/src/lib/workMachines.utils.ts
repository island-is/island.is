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
  SupervisorChange,
} from './workMachines.types'

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

export const apiChangeSupervisorToApiRequest = (
  changeSupervisor: SupervisorChange,
): ApiMachineSupervisorChangePostRequest => {
  const machineSupervisorChangeDto: MachineSupervisorChangeDto = {
    machineId: changeSupervisor.machineId,
    delegateNationalId: changeSupervisor.delegateNationalId,
    ownerNationalId: changeSupervisor.ownerNationalId,
    supervisorNationalId: changeSupervisor.supervisorNationalId,
    email: changeSupervisor.email,
    phoneNumber: changeSupervisor.phoneNumber,
    address: changeSupervisor.address,
    postalCode: changeSupervisor.postalCode,
    moreInfo: changeSupervisor.moreInfo,
  }

  return { machineSupervisorChangeDto }
}
