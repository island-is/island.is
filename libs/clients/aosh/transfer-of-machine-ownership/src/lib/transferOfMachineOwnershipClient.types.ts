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
