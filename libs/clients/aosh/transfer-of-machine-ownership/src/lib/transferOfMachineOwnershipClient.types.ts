type MachineLink = {
  href?: string | null
  rel?: string | null
  method?: string | null
  displayTitle?: string | null
}

export interface Machine {
  id?: string
  registrationNumber?: string | null
  type?: string | null
  owner?: string | null
  supervisor?: string | null
  status?: string | null
  dateLastInspection?: string | null
  category?: string | null
  subCategory?: string | null
}

export type MachineDetails = {
  id?: string
  registrationNumber?: string | null
  type?: string | null
  status?: string | null
  category?: string | null
  subCategory?: string | null
  productionYear?: number | null
  registrationDate?: string | null
  ownerNumber?: string | null
  productionNumber?: string | null
  productionCountry?: string | null
  licensePlateNumber?: string | null
  importer?: string | null
  insurer?: string | null
  ownerName?: string | null
  ownerNationalId?: string | null
  ownerAddress?: string | null
  ownerPostcode?: string | null
  supervisorName?: string | null
  supervisorNationalId?: string | null
  supervisorAddress?: string | null
  supervisorPostcode?: string | null
  _links?: MachineLink[] | null
}

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
  phoneNumber?: string | null
  email?: string | null
}
