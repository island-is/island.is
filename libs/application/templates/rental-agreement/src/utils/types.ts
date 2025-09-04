import { UploadFile } from '@island.is/island-ui/core'
import { YesOrNoEnum } from '@island.is/application/core'
import {
  DefaultEvents,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { RentalHousingCategoryClass, CostField, AddressProps } from '../shared'
import {
  OtherFeesPayeeOptions,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from './enums'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.EDIT | DefaultEvents.APPROVE
}

export type StatusProvider = 'failure' | 'success'

export type SelectOption = {
  value: string
  label: {
    id: string
    defaultMessage: string
    description: string
  }
}

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
}

export interface PropertyInfo {
  categoryType: RentalHousingCategoryTypes
  categoryClass: RentalHousingCategoryClass
  categoryClassGroup: RentalHousingCategoryClassGroup
}

export interface OtherFees {
  housingFund?: OtherFeesPayeeOptions
  electricityCost?: OtherFeesPayeeOptions
  heatingCost?: OtherFeesPayeeOptions
  otherCosts?: string[]
  otherCostItems?: CostField[]
  electricityCostMeterStatusDate?: string
  heatingCostMeterStatusDate?: string
  housingFundAmount?: string
  electricityCostMeterNumber?: string
  electricityCostMeterStatus?: string
  heatingCostMeterNumber?: string
  heatingCostMeterStatus?: string
}

export interface ApplicationAnswers {
  registerProperty?: {
    categoryClass?: RentalHousingCategoryClass
    categoryClassGroup?: RentalHousingCategoryClassGroup
    categoryType?: RentalHousingCategoryTypes
    searchResults?: AddressProps
    searchResultUnits?: FormValue[]
  }

  rentalAmount?: {
    securityDepositRequired?: YesOrNoEnum
    amount?: string
    paymentDateOptions?: string
    paymentMethodOptions?: RentalPaymentMethodOptions
    paymentMethodNationalId?: string
    paymentMethodAccountNumber?: string
    paymentMethodOtherTextField?: string
    indexConnected?: YesOrNoEnum
    indexRate?: string
  }
  rentalPeriod?: {
    startDate?: string
    endDate?: string
    isIndefinite?: string
  }
  securityDeposit?: {
    securityAmountCalculated?: string
    securityAmountOther?: string
    securityType?: SecurityDepositTypeOptions
  }
  condition?: {
    inspector?: RentalHousingConditionInspector
    inspectorName?: string
    resultsFiles?: UploadFile[]
    resultsDescription?: string
  }
  specialProvisions?: {
    descriptionInput?: string
    rulesInput?: string
  }
  fireProtections?: {
    smokeDetectors?: string
    fireExtinguisher?: string
    emergencyExits?: string
    fireBlanket?: string
  }
  otherFees?: OtherFees
  [key: string]: unknown
}
