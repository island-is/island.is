import { YesOrNoEnum } from '@island.is/application/core'
import { NextStepInReviewOptions } from '../utils/enums'

export type Maybe<T> = T | null

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type ApplicantsInfo = {
  nationalIdWithName: { name: string; nationalId: string }
  phone: string
  email: string
  address: string
  isRepresentative?: boolean
}

export type LandlordInfo = {
  nationalIdWithName: { name: string; nationalId: string }
  phone: string
  address: string
  email: string
  isRepresentative: Array<string>
}

export type CostField = {
  description: string
  amount?: number
}

export type Files = {
  name: string
  key: string
  url: string
}

export interface PropertyUnit {
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  appraisalUnitCode?: Maybe<Scalars['Float']>
  fireInsuranceValuation?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
  sizeUnit?: Maybe<Scalars['String']>
  unitCode?: Maybe<Scalars['String']>
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

type Unit = {
  __typename?: 'Unit'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  appraisalUnitCode?: Maybe<Scalars['Float']>
  fireInsuranceValuation?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
  sizeUnit?: Maybe<Scalars['String']>
  unitCode?: Maybe<Scalars['String']>
}

type AppraisalUnit = {
  __typename?: 'AppraisalUnit'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyLandValue?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  unitCode?: Maybe<Scalars['String']>
  units?: Maybe<Array<Unit>>
}

type HmsPropertyInfo = {
  __typename?: 'HmsPropertyInfo'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  appraisalUnits?: Maybe<Array<AppraisalUnit>>
  landCode?: Maybe<Scalars['Float']>
  municipalityCode?: Maybe<Scalars['Float']>
  municipalityName?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyLandValue?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
  sizeUnit?: Maybe<Scalars['String']>
  unitCode?: Maybe<Scalars['String']>
}

export interface AddressProps {
  addressCode?: Maybe<Scalars['Float']>
  address?: Maybe<Scalars['String']>
  municipalityName?: Maybe<Scalars['String']>
  municipalityCode?: Maybe<Scalars['Float']>
  postalCode?: Maybe<Scalars['Float']>
  landCode?: Maybe<Scalars['Float']>
  streetName?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['Float']>
  label: string
  value: string
  numOfConnectedProperties?: Maybe<Scalars['Float']>
  units?: PropertyUnit[]
  checkedUnits?: Record<string, boolean>
  numOfRooms?: Record<string, number>
  changedValueOfUnitSize?: Record<string, number>
  selectedPropertyCode?: Maybe<Scalars['Float']>
  propertiesByAddressCode?: Array<HmsPropertyInfo>
}

export interface ParticipantsSection {
  landlords: ApplicantsInfo[]
  landlordRepresentatives: ApplicantsInfo[]
  tenants: ApplicantsInfo[]
}

export interface PropertySection {
  searchResults: AddressProps | undefined
  searchResultLabel: string | undefined
  units: PropertyUnit[]
  categoryType: string | undefined
  categoryClass: string | undefined
  categoryClassGroup: string | undefined
}

export interface ProvisionsAndConditionSection {
  description: string | undefined
  rules: string | undefined
  conditionDescription: string | undefined
  inspector: string | undefined
  inspectorName: string | undefined
  files: Files[] | undefined
}

export interface FireProtectionSection {
  fireBlanket: string | undefined
  smokeDetectors: string | undefined
  fireExtinguisher: string | undefined
  emergencyExits: string | undefined
}

export interface RentalPeriodSection {
  startDate: string | undefined
  endDate: string | undefined
  isDefinite: string | undefined
}

export interface ConsumerIndexItem {
  month: string
  value: string
}

export interface BankAccount {
  bankNumber: string
  ledger: string
  accountNumber: string
}

export interface RentalAmountSection {
  amount: string | undefined
  isIndexConnected: Array<YesOrNoEnum> | undefined
  indexDate: string | undefined
  indexRate: string | undefined
  paymentMethodOptions: string | undefined
  paymentMethodOther: string | undefined
  paymentDateOptions: string | undefined
  paymentDayOther: string | undefined
  paymentMethodBankAccountNumber: BankAccount | undefined
  paymentMethodNationalId: string | undefined
  securityDepositRequired: YesOrNoEnum | undefined
}

export interface SecurityDepositSection {
  securityType: string | undefined
  bankGuaranteeInfo: string | undefined
  thirdPartyGuaranteeInfo: string | undefined
  insuranceCompanyInfo: string | undefined
  landlordsMutualFundInfo: string | undefined
  otherInfo: string | undefined
  securityDepositAmount: string | undefined
  securityAmountOther: string | undefined
  securityAmountCalculated: string | undefined
  securityAmountHiddenRentalAmount: string | undefined
}

export interface OtherFeesSection {
  housingFundPayee: string | undefined
  housingFundAmount: string | undefined
  electricityCostPayee: string | undefined
  electricityCostMeterStatusDate: string | undefined
  electricityCostMeterNumber: string | undefined
  electricityCostMeterStatus: string | undefined
  heatingCostPayee: string | undefined
  heatingCostMeterStatusDate: string | undefined
  heatingCostMeterNumber: string | undefined
  heatingCostMeterStatus: string | undefined
  otherCostPayedByTenant: YesOrNoEnum | undefined
  otherCostItems: CostField[] | undefined
}

export interface ReviewSection {
  nextStepInReviewOptions: NextStepInReviewOptions | undefined
}

export interface RentalAgreementAnswers
  extends ParticipantsSection,
    PropertySection,
    ProvisionsAndConditionSection,
    FireProtectionSection,
    RentalPeriodSection,
    RentalAmountSection,
    SecurityDepositSection,
    OtherFeesSection,
    ReviewSection {}

export interface DraftPartyContact {
  email: string
  phone: string
  nationalIdWithName: DraftNationalIdWithName
}

export interface DraftNationalIdWithName {
  name: string
  nationalId: string
}
export interface DraftTenantInfo {
  table: DraftPartyContact[]
}

export interface DraftLandlordInfo {
  table: DraftPartyContact[]
  shouldShowRepresentativeTable: string[]
  representativeTable: DraftPartyContact[]
}
export interface DraftParties {
  tenantInfo: DraftTenantInfo
  landlordInfo: DraftLandlordInfo
}
export interface DraftResultsFile {
  key: string
  name: string
}
export interface DraftCondition {
  inspector: string
  resultsFiles: DraftResultsFile[]
  resultsDescription: string
}
export interface DraftOtherFees {
  otherCosts: string[]
  heatingCost: string
  housingFund: string
  electricityCost: string
}
export interface DraftPropertyInfo {
  categoryType: string
  categoryClass: string
}

export interface DraftBankAccountNumber {
  ledger: string
  bankNumber: string
  accountNumber: string
}

export interface DraftRentalAmount {
  amount: string
  isIndexConnected: string[]
  paymentDateOptions: string
  paymentMethodOptions: string
  rentalPeriodStartDate: string
  rentalPeriodIsDefinite: string[]
  paymentMethodNationalId: string
  securityDepositRequired: string[]
  paymentMethodBankAccountNumber: DraftBankAccountNumber
}

export interface DraftRentalPeriod {
  endDate: string
  startDate: string
  isDefinite: string[]
}

export interface DraftFireProtections {
  fireBlanket: string
  propertySize: PropertyUnit[]
  emergencyExits: string
  smokeDetectors: string
  fireExtinguisher: string
}

export interface DraftRegisterProperty {
  searchresults: DraftSearchResults
}

export interface DraftSearchResults {
  label: string
  units: PropertyUnit[]
  value: string
  address: string
  landCode: number
  numOfRooms: object
  postalCode: number
  addressCode: number
  checkedUnits: object
  municipalityCode: number
  municipalityName: string
  changedValueOfUnitSize: object
  propertiesByAddressCode: DraftPropertyByAddressCode[]
  numOfConnectedProperties: number
}

export interface DraftAppraisalUnit {
  units: PropertyUnit[]
  address: string
  unitCode: string
  addressCode: number
  propertyCode: number
  propertyValue: number
  propertyLandValue: object
  propertyUsageDescription: string
}

export interface DraftPropertyByAddressCode {
  size: number
  address: string
  landCode: number
  sizeUnit: string
  unitCode: string
  postalCode: number
  addressCode: number
  propertyCode: number
  propertyValue: number
  appraisalUnits: DraftAppraisalUnit[]
  municipalityCode: number
  municipalityName: string
  propertyLandValue: number
  propertyUsageDescription: string
}

export interface DraftSpecialProvisions {
  rulesInput: string
  descriptionInput: string
  propertySearchUnits: PropertyUnit[]
}
export interface DraftAnswersObject {
  parties?: DraftParties
  condition?: DraftCondition
  otherFees?: DraftOtherFees
  propertyInfo?: DraftPropertyInfo
  rentalAmount?: DraftRentalAmount
  rentalPeriod?: DraftRentalPeriod
  fireProtections?: DraftFireProtections
  registerProperty?: DraftRegisterProperty
  specialProvisions?: DraftSpecialProvisions
}
