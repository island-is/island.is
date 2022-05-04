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

// TODO: WIP
export interface Answers {
  applicantEmail: string
  applicantName: string
  applicantPhone: string
  applicantRelation: RelationEnum
  approveExternalData: true
  authorizationForFuneralExpenses?: boolean
  certificateOfDeathAnnouncement: string
  estateMembers: EstateMember[]
  financesDataCollectionPermission?: boolean
  knowledgeOfOtherWills: 'yes' | 'no'
  otherProperties: Property[]
  roleConfirmation: RoleConfirmationEnum
}

export interface ElectPersonType {
  roleConfirmation: RoleConfirmationEnum
  electedPersonName?: string
  electedPersonNationalId?: string
  lookupError?: boolean
}

export interface EstateMember {
  name: string
  nationalId: string
  relation: RelationEnum
  initial?: boolean
  dateOfBirth?: string
  custodian?: string
  foreignCitizenship?: ('yes' | 'no')[]
}

export interface Property {
  propertyNumber: string
  address?: string
}

export interface Vehicle {
  plateNumber: string
  numberOfWheels: number
  weight: number
  year: number
}

export interface Will {
  nationalId: string
  hasWill: boolean
}

export interface Prenup {
  hasPrenup: boolean
  nationalId: string
  partnerNationalId?: string
}
