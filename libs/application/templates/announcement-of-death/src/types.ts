import { FormValue, GenericFormField } from '@island.is/application/types'
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
export enum PropertiesEnum {
  REAL_ESTATE = 'realEstate',
  VEHICLES = 'vehicles',
  ACCOUNTS = 'accounts',
  OWN_BUSINESS = 'ownBusiness',
  RESIDENCE = 'residence',
  ASSETS_ABROAD = 'assetsAbroad',
}

export type Asset = Partial<EstateAsset & { initial: boolean; dummy?: boolean }>

export type AssetFormField = Asset & { id: string }

export type Answers = {
  additionalInfo: string
  addApplicantToEstateMembers: string[]
  applicantEmail: string
  applicantName: string
  applicantPhone: string
  applicantRelation: RelationEnum
  approveExternalData: true
  assets: {
    assets: Asset[]
    encountered?: boolean
  }
  assetsAbroad: boolean
  authorizationForFuneralExpenses: string
  bankStockOrShares: boolean
  caseNumber: string
  certificateOfDeathAnnouncement: string
  districtCommissionerHasWill: boolean
  estateMembers: {
    members: EstateMember[]
    encountered?: boolean
    applicantAdded?: boolean
  }
  financesDataCollectionPermission: string
  knowledgeOfOtherWills: 'yes' | 'no'
  hadFirearms: 'yes' | 'no'
  firearmApplicant: FirearmApplicant
  marriageSettlement: boolean
  occupationRightViaCondominium: boolean
  otherProperties: PropertiesEnum
  ownBusinessManagement: boolean
  roleConfirmation: RoleConfirmationEnum
  vehicles: {
    vehicles: Asset[]
    encountered?: boolean
  }
} & FormValue

export interface FirearmApplicant {
  nationalId: string
  name: string
  phone: string
  email: string
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
  relation: RelationEnum | string
  initial?: boolean
  dateOfBirth?: string
  custodian?: string
  foreignCitizenship?: ('yes' | 'no')[]
  dummy: boolean
}

export type EstateMemberField = GenericFormField<EstateMember>

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
