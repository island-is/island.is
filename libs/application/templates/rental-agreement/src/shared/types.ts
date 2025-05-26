import { HmsSearchAddress, Unit as OriginalUnit } from '@island.is/api/schema'

export type ApplicantsInfo = {
  nationalIdWithName: { name: string; nationalId: string }
  phone: string
  address: string
  email: string
  isRepresentative: string[]
}

export type CostField = {
  description: string
  amount?: number
  hasError?: boolean
}

export interface Unit extends OriginalUnit {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

export interface AddressProps extends HmsSearchAddress {
  label: string
  value: string
}
