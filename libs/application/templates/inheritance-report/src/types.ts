import { FormValue } from '@island.is/application/types'
import { Advocate, EstateAsset } from '@island.is/clients/syslumenn'

export enum RoleConfirmationEnum {
  CONTINUE = 'continue',
  DELEGATE = 'delegate',
}

export enum RelationEnum {
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  SPOUSE = 'spouse',
  ADVOCATE = 'advocate',
}
export enum OtherPropertiesEnum {
  ACCOUNTS = 'accounts',
  OWN_BUSINESS = 'ownBusiness',
  RESIDENCE = 'residence',
  ASSETS_ABROAD = 'assetsAbroad',
}

export type DeceasedShare = {
  deceasedShare: string
  deceasedShareEnabled: string[]
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

export interface GunsData extends DeceasedShare {
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
  enabled?: boolean
}

export interface Money extends DeceasedShare {
  info: string
  value: string
}

export interface ClaimsData extends DeceasedShare {
  value: string
  propertyValuation: string
  description: string
  issuer: string
  nationalId: string
  taxFreeInheritance: number
  enabled?: boolean
}

export interface Claims {
  data: ClaimsData[]
  total: number
}

export interface StocksData extends DeceasedShare {
  value: string
  assetNumber: string
  description: string
  propertyValuation: string
  amount: string
  faceValue: string
  nationalId: string
  organization: string
  rateOfExchange: string
  exchangeRateOrInterest: string
  taxFreeInheritance: number
  enabled?: boolean
}

export interface Stocks {
  data: StocksData[]
  total: number
}

export interface VehiclesData extends DeceasedShare {
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
  enabled?: boolean
}

export interface Vehicles {
  data: VehiclesData[]
  hasModified?: boolean
  total: number
}

export interface Inventory extends DeceasedShare {
  info: string
  value: string
}

export interface RealEstateData extends DeceasedShare {
  share: string
  assetNumber: string
  description: string
  propertyValuation: string
  taxFreeInheritance: number
  enabled?: boolean
  initial?: boolean
}

export interface RealEstate {
  data?: RealEstateData[]
  hasModified?: boolean
  total: number
}

export interface OtherAssetsData extends DeceasedShare {
  info: string
  value: string
  taxFreeInheritance: number
}
export interface OtherAssets {
  data: OtherAssetsData[]
  total: number
}

export interface BankAccountsData extends DeceasedShare {
  exchangeRateOrInterest: string
  propertyNumber: string
  assetNumber: string
  propertyValuation: string
  foreignBankAccount?: ('yes' | 'no')[]
  taxFreeInheritance: number
  enabled?: boolean
}

export interface BankAccounts {
  data: BankAccountsData[]
  total: number
}

export interface Debt {
  assetNumber: string
  nationalId: string
  description: string
  propertyValuation: string
  debtType: string
}

export interface ApplicationDebts {
  publicCharges: string
  domesticAndForeignDebts: DomesticAndForeignDebts
}

interface DomesticAndForeignDebts {
  data: Debt[]
  total: number
}

export interface BuisnessAssetsData {
  assetType: 'estate' | 'asset'
  assetNumber: string
  description: string
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
  GRANTOR = 'grantor',
}

export interface EstateMember {
  name: string
  nationalId: string
  relation: string
  initial?: boolean
  dateOfBirth?: string
  foreignCitizenship?: ('yes' | 'no')[]
  enabled?: boolean
  phone?: string
  email?: string
  advocate?: Advocate
  heirsPercentage?: string
  inheritance?: string
  inheritanceTax?: string
  taxableInheritance?: string
  taxFreeInheritance?: string
}

export const heirAgeValidation = 'heirAgeValidation'
export const heirNationalIdSameAsExecutorValidation =
  'heirNationalIdSameAsExecutorValidation'

export enum DebtTypes {
  Overdraft = 'Yfirdráttur',
  CreditCard = 'Kreditkort',
  Loan = 'Lán',
  PropertyFees = 'Fasteignagjöld',
  OtherDebts = 'Aðrar skuldir',
  PublicCharges = 'Opinber gjöld',
  InsuranceInstitute = 'Tryggingarstofnun ríkisins',
}

// Note: Please keep this in lockstep with the FuneralAssetItem
//       found in clients/syslumenn.
//       application-system-form refuses to build if this enum
//       is imported from '@island.is/clients/syslumenn'
export const FuneralAssetItem = {
  Casket: 0, // Smíði kistu og umbúnaður
  Announcements: 1, // Dánartilkynningar
  Printing: 2,
  Flowers: 3,
  Music: 4,
  Venue: 5,
  Wake: 6,
  Tombstone: 7,
  FuneralServices: 8,
  Cremation: 9,
  Other: 10,
} as const
export type FuneralAssetItem =
  typeof FuneralAssetItem[keyof typeof FuneralAssetItem]
