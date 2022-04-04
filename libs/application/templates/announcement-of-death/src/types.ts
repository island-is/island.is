export enum RoleConfirmationEnum {
  CONTINUE = 'continue',
  DELEGATE = 'delegate',
}

export enum RelationEnum {
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  SPOUSE = 'spouse',
}

export interface ElectPersonType {
  roleConfirmation: RoleConfirmationEnum
  electedPersonName?: string
  electedPersonNationalId?: string
  lookupError?: boolean
}

export interface EstateMember {
  nationalId: string
  relation: RelationEnum
  hasForeignCitizenship?: boolean
}

export interface Property {
  propertyNumber: string
  address?: string
}

export interface Vehicle {
  vehicleNumber: string
  address?: string
}

export interface Will {
  nationalId: string
  hasWill: boolean
}
