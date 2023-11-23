import {
  ApiMachineOwnerChangePutRequest,
  MachineOwnerChangeCompleteDto,
  ApiMachineOwnerChangePostRequest,
  MachineOwnerChangeCreateDto,
} from '../../gen/fetch'
import {
  ConfirmOwnerChange,
  ChangeMachineOwner,
} from './transferOfMachineOwnershipClient.types'

export const confirmChangeToApiRequest = (
  confirmChange: ConfirmOwnerChange,
): ApiMachineOwnerChangePutRequest => {
  const machineOwnerChangeCompleteDto: MachineOwnerChangeCompleteDto = {
    id: confirmChange.id || undefined,
    machineId: confirmChange.machineId || undefined,
    buyerNationalId: confirmChange.buyerNationalId || null,
    delegateNationalId: confirmChange.delegateNationalId || null,
    supervisorNationalId: confirmChange.supervisorNationalId || null,
    supervisorEmail: confirmChange.supervisorEmail || null,
    supervisorPhoneNumber: confirmChange.supervisorPhoneNumber || null,
    machineAddress: confirmChange.machineAddress || null,
    machineMoreInfo: confirmChange.machineMoreInfo || null,
    machinePostalCode: confirmChange.machinePostalCode || null,
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
