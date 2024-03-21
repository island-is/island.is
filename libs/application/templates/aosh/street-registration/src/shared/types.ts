export type Machine = {
  id?: string
  regNumber?: string
  date?: string
  subType?: string
  type?: string
  category?: string
  plate?: string
  ownerNumber?: string
}

export enum Plate {
  A = 'A',
  B = 'B',
  D = 'D',
}

export enum AddressDeliveryType {
  CURRENT = 'CurrentAddress',
  OTHER = 'OtherAddress',
}

export type CurrentAddress = {
  streetAddress?: string
  postalCode?: string
  city?: string
}
