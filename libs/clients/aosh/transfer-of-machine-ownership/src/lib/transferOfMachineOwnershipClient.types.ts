export type ChangeMachineOwner = {
  id?: string
  machineId?: string | null
  buyerNationalId?: string | null
  delegateNationalId?: string | null
  sellerNationalId?: string | null
  dateOfOwnerChange?: Date | null
  paymentId?: string | null
  phoneNumber?: string | null
  email?: string | null
}

export type ConfirmOwnerChange = {
  id?: string
  machineId?: string | null
  machineMoreInfo?: string | null
  machinePostalCode?: number | null
  buyerNationalId?: string | null
  delegateNationalId?: string | null
  supervisorNationalId?: string | null
  supervisorEmail?: string | null
  supervisorPhoneNumber?: string | null
  machineAddress?: string | null
}

export type ChangeMachineSupervisor = {
  machineId?: string | null
  delegateNationalId?: string | null
  ownerNationalId?: string | null
  supervisorNationalId?: string | null
  email?: string | null
  phoneNumber?: string | null
  address?: string | null
  postalCode?: number | null
  moreInfo?: string | null
}
