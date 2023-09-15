export enum RoleConfirmationEnum {
  CONTINUE = 'continue',
  DELEGATE = 'delegate',
}

export interface Address {
  streetAddress: string
  postalCode: string
  city: string
}

export interface NationalRegistry {
  nationalId: string
  fullName: string
  address: Address
}

export interface RealEstateAddress {
  address: string
}

export type PickRole = {
  roleConfirmation: RoleConfirmationEnum
  electPerson: {
    electedPersonNationalId: string
    electedPersonName: string
  }
}
