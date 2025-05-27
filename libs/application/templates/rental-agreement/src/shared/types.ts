import { YesOrNoEnum } from '@island.is/application/core'
import { NextStepInReviewOptions } from '../utils/enums'

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
  appraisalUnitCode?: number
  propertyValue?: number
  propertyCode?: number
  propertyUsageDescription?: string
  unitCode?: string
  addressCode?: number
  address?: string
  fireInsuranceValuation?: number
  size?: number
  sizeUnit?: string
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

export interface AddressProps {
  addressCode?: number
  address?: string
  municipalityName?: string
  municipalityCode?: number
  postalCode?: number
  landCode?: number
  streetName?: string
  streetNumber?: number
  numOfConnectedProperties?: number
  label: string
  value: string
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

export interface RentalAmountSection {
  rentalAmount: string | undefined
  isIndexConnected: string | undefined
  indexType: string | undefined
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
