import { FormValue } from '@island.is/application/types'
import { EstateAsset } from '@island.is/clients/syslumenn'
import e from 'express'

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

export type Asset = Partial<EstateAsset & { initial: boolean; dummy?: boolean }>

export type Answers = {
  additionalInfo: string
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
  authorizationForFuneralExpenses?: boolean
  bankStockOrShares: boolean
  caseNumber: string
  certificateOfDeathAnnouncement: string
  districtCommissionerHasWill: boolean
  estateMembers: {
    members: EstateMember[]
    encountered?: boolean
  }
  financesDataCollectionPermission?: boolean
  knowledgeOfOtherWills: 'yes' | 'no'
  marriageSettlement: boolean
  occupationRightViaCondominium: boolean
  otherProperties: OtherPropertiesEnum
  ownBusinessManagement: boolean
  roleConfirmation: RoleConfirmationEnum
  vehicles: {
    vehicles: Asset[]
    encountered?: boolean
  }
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
  dummy: boolean
  enabled?: boolean
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

export interface EstateAssets {
  guns: Guns
  money: Money
  claims: Claims
  stocks: Stocks
  vehicles: Vehicles
  inventory: Inventory
  realEstate: RealEstate
  otherAssets: OtherAssets
  bankAccounts: BankAccounts
}

export interface Guns {
  data: GunsData[]
  total: number
}

export interface GunsData {
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
}

export interface Money {
  info: string
  value: string
}

export interface ClaimsData {
  value: string
  issuer: string
  nationalId: string
  taxFreeInheritance: number
}
export interface Claims {
  data: ClaimsData[]
  total: number
}

export interface StocksData {
  value: string
  faceValue: string
  nationalId: string
  organization: string
  rateOfExchange: string
  taxFreeInheritance: number
}
export interface Stocks {
  data: StocksData[]
  total: number
}

export interface VehiclesData {
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
}

export interface Vehicles {
  data: VehiclesData[]
  total: number
}

export interface Inventory {
  info: string
  value: string
}

export interface RealEstateData {
  share: number
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
}

export interface RealEstate {
  data: RealEstateData[]
  total: number
}

export interface otherassetsData {
  otherAssets: string
  otherAssetsValue: string
  taxFreeInheritance: number
}
export interface OtherAssets {
  data: otherassetsData[]
  total: number
}

export interface BankAccountsData {
  balance: string
  accountNumber: string
  taxFreeInheritance: number
}

export interface BankAccounts {
  data: BankAccountsData[]
  total: number
}

export interface AllDebts {
  balance: string
  nationalId: string
  creditorName: string
  loanIdentity: string
  taxFreeInheritance: number
}

export interface ApplicationDebts {
  publicCharges: PublicCharges
  domesticAndForeignDebts: DomesticAndForeignDebts
}

export interface PublicChargesData {
  taxFreeInheritance: number
  publicChargesAmount: string
}

interface DomesticAndForeignDebtsData {
  balance: string
  nationalId: string
  loanIdentity: string
  creditorName: string
  taxFreeInheritance: number
}
interface DomesticAndForeignDebts {
  data: DomesticAndForeignDebtsData[]
  total: number
}

export interface PublicCharges {
  data: PublicChargesData[]
  total: number
}

export interface BuisnessAssetsData {
  businessAsset: string
  businessAssetValue: string
  taxFreeInheritance: number
}

export interface BuisnessAssets {
  data: BuisnessAssetsData[]
  total: number
}
export interface BuisnessDebtData {
  debtValue: string
  nationalId: string
  businessDebt: string
  taxFreeInheritance: number
}
export interface BuisnessDebt {
  data: BuisnessDebtData[]
  total: number
}

export interface Buisness {
  businessAssets: BuisnessAssets
  businessDebts: BuisnessDebt
  businessTotal: number
}

// todo: do these value labels make sense?
export enum RelationEnum {
  REPRESENTATIVE = 'representative',
  HEIR = 'heir',
  EXCHANGEMANAGER = 'exchangeManager',
}
