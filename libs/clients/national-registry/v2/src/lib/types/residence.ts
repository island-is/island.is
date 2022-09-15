import { Address } from './address'

export interface Residence {
  address: Address
  houseIdentificationCode?: string | null
  realEstateNumber?: string | null
  country?: string | null
  dateOfChange?: Date | null
}
