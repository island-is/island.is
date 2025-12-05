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

export type AnswerApplicant = {
  city: string
  name: string
  email: string
  address: string
  nationalId: string
  postalCode: string
  phoneNumber: string
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
  signingParties: ApplicantsInfo[]
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
  mutualFundInfo: string | undefined
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

export interface DraftPropertyUnit {
  address?: string
  addressCode?: number
  appraisalUnitCode?: number
  fireInsuranceValuation?: number
  propertyCode?: number
  propertyUsageDescription?: string
  propertyValue?: number
  size?: number
  sizeUnit?: string
  unitCode?: string
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

export interface DraftAppraisalUnit {
  units: DraftPropertyUnit[]
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

export interface DraftAnswers {
  contractId: string
  landlords: DraftPartyContact[]
  landlordRepresentatives: DraftPartyContact[]
  tenants: DraftPartyContact[]
  signingParties: ApplicantsInfo[]
  units: DraftPropertyUnit[]
  startDate: string
  endDate: string
  amount: string
  isIndexConnected: YesOrNoEnum[]
  indexDate: string
  indexRate: string
  paymentMethodOther?: string
  paymentDateOptions: string
  paymentDayOther?: string
  paymentMethodOptions: string
  paymentMethodBankAccountNumber: BankAccount
  securityDepositRequired: YesOrNoEnum
  securityType: string
  bankGuaranteeInfo: string
  thirdPartyGuaranteeInfo: string
  insuranceCompanyInfo: string
  mutualFundInfo: string
  otherInfo: string
  securityDepositAmount: string
  securityAmountOther: string
  securityAmountCalculated: string
  categoryType: string
  categoryClass: string
  categoryClassGroup: string
  description: string
  rules: string
  conditionDescription: string
  inspector: string
  inspectorName?: string
  smokeDetectors: string
  fireExtinguisher: string
  fireBlanket: string
  emergencyExits: string
  housingFundPayee: string
  housingFundAmount?: string
  electricityCostPayee: string
  electricityCostMeterStatusDate?: string
  electricityCostMeterNumber?: string
  electricityCostMeterStatus?: string
  heatingCostPayee: string
  heatingCostMeterStatusDate?: string
  heatingCostMeterNumber?: string
  heatingCostMeterStatus?: string
  otherCostPayedByTenant: YesOrNoEnum
  otherCostItems: CostField[]
}
