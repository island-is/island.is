import { UploadFile } from '@island.is/island-ui/core'
import { YesOrNoEnum } from '@island.is/application/core'
import { Unit as OriginalUnit } from '@island.is/api/schema'
import {
  DefaultEvents,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from './enums'
import { AddressProps } from '../fields/PropertySearch'

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.EDIT }

export type StatusProvider = 'failure' | 'success'

export type CostField = {
  description: string
  amount?: number
  hasError?: boolean
}

export type ApplicantsInfo = {
  nationalIdWithName: { name: string; nationalId: string }
  email: string
  phone: string
  isRepresentative: string[]
}

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

export interface Unit extends OriginalUnit {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
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
    indexTypes?: string
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
  otherFees?: {
    housingFund?: OtherFeesPayeeOptions
    electricityCost?: OtherFeesPayeeOptions
    heatingCost?: OtherFeesPayeeOptions
    otherCostItems?: CostField[] | string
    electricityCostMeterStatusDate?: string
    heatingCostMeterStatusDate?: string
    housingFundAmount?: string
    electricityCostMeterNumber?: string
    electricityCostMeterStatus?: string
    heatingCostMeterNumber?: string
    heatingCostMeterStatus?: string
  }
  [key: string]: unknown
}
