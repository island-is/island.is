export type ChangeMachineOwner = {
  applicationId: string
  machineId: string
  buyerNationalId: string
  delegateNationalId: string
  sellerNationalId: string
  dateOfOwnerChange: Date
  paymentId: string | null
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
  paymentRequiredForOwnerChange?: boolean
  errorMessage?: string | null
}

export type SupervisorChange = {
  machineId?: string
  delegateNationalId?: string | null
  ownerNationalId?: string | null
  supervisorNationalId?: string | null
  email?: string | null
  phoneNumber?: string | null
  address?: string | null
  postalCode?: number | null
  moreInfo?: string | null
}

export type MachinesWithTotalCount = {
  machines: MachineDto[]
  totalCount: number
}

export type MachineForInspectionDto = {
  id?: string
  owner?: { number?: string; name: string }
  licensePlateNumber?: string | null
  type?: string | null
  subType?: string | null
  category?: string | null
  registrationNumber?: string | null
  supervisor?: string | null
  status?: string | null
  paymentRequiredForOwnerChange?: boolean | null
  errorMessage?: string | null
  disabled?: boolean | null
}

export type MachineForInspectionTotalCount = {
  machines: MachineForInspectionDto[]
  totalCount: number
}
