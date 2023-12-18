export type ChangeMachineOwner = {
  applicationId: string
  machineId: string
  buyerNationalId: string
  delegateNationalId: string
  sellerNationalId: string
  dateOfOwnerChange: Date
  paymentId: string
  phoneNumber: string
  email: string
}

export type ConfirmOwnerChange = {
  applicationId: string
  machineId: string
  machineMoreInfo?: string | null
  machinePostalCode?: number
  buyerNationalId: string
  delegateNationalId: string
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

export type MachineDto = {
  disabled?: boolean
  id?: string
  ownerNumber?: string
  plate?: string
  subType?: string
  type?: string
  category?: string
  regNumber?: string
  supervisorName?: string
  status?: string
}
