import { FormValue } from '@island.is/application/core'
import { EstateAsset } from '@island.is/clients/syslumenn'

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
export enum OtherPropertiesEnum {
  ACCOUNTS = 'accounts',
  OWN_BUSINESS = 'ownBusiness',
  RESIDENCE = 'residence',
  ASSETS_ABROAD = 'assetsAbroad',
}

export type Asset = Partial<EstateAsset & { initial: boolean }>

// TODO: WIP
export type Answers = {
  additionalInfo: string
  applicantEmail: string
  applicantName: string
  applicantPhone: string
  applicantRelation: RelationEnum
  approveExternalData: true
  assets: Asset[]
  assetsAbroad: boolean
  authorizationForFuneralExpenses?: boolean
  bankStockOrShares: boolean
  caseNumber: string
  certificateOfDeathAnnouncement: string
  districtCommissionerHasWill: boolean
  estateMembers: EstateMember[]
  financesDataCollectionPermission?: boolean
  knowledgeOfOtherWills: 'yes' | 'no'
  marriageSettlement: boolean
  occupationRightViaCondominium: boolean
  otherProperties: OtherPropertiesEnum
  ownBusinessManagement: boolean
  roleConfirmation: RoleConfirmationEnum
  vehicles: Asset[]
} & FormValue

export interface ElectPersonType {
  roleConfirmation: RoleConfirmationEnum
  electedPersonName?: string
  electedPersonNationalId?: string
  lookupError?: boolean
}

export interface EstateMember {
  name: string
  nationalId: string
  relation: RelationEnum | string
  initial?: boolean
  dateOfBirth?: string
  custodian?: string
  foreignCitizenship?: ('yes' | 'no')[]
}

export interface Property {
  propertyNumber: string
  address?: string
  initial?: boolean
}

export interface Vehicle {
  plateNumber: string
  numberOfWheels: number
  weight: number
  year: number
  initial?: boolean
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
