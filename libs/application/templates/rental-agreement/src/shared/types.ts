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
  address: string
  email: string
  isRepresentative: string[]
}

export type CostField = {
  description: string
  amount?: number
  hasError?: boolean
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

export interface AddressProps {
  label: string
  value: string
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  landCode?: Maybe<Scalars['Float']>
  municipalityCode?: Maybe<Scalars['Float']>
  municipalityName?: Maybe<Scalars['String']>
  numOfConnectedProperties?: Maybe<Scalars['Float']>
  postalCode?: Maybe<Scalars['Float']>
  streetName?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['Float']>
}

export interface ParticipantsSection {
  landlords: ApplicantsInfo[]
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

export interface RentalAmountSection {
  rentalAmount: string | undefined
  isIndexConnected: YesOrNoEnum | undefined
  indexDate: string | undefined
  indexRate: string | undefined
  paymentMethod: string | undefined
  paymentMethodOther: string | undefined
  paymentDay: string | undefined
  paymentDayOther: string | undefined
  bankAccountNumber: string | undefined
  nationalIdOfAccountOwner: string | undefined
  securityDepositRequired: YesOrNoEnum | undefined
}

export interface SecurityDepositSection {
  securityDepositType: string | undefined
  bankGuaranteeInfo: string | undefined
  thirdPartyGuaranteeInfo: string | undefined
  insuranceCompanyInfo: string | undefined
  landlordsMutualFundInfo: string | undefined
  otherInfo: string | undefined
  securityDepositAmount: string | undefined
  securityDepositAmountOther: string | undefined
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
