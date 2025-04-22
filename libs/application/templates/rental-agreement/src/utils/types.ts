import {
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
} from './constants'
import { UploadFile } from '@island.is/island-ui/core'

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
}

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

export interface ApplicationAnswers {
  registerProperty?: {
    categoryClass?: RentalHousingCategoryClass
    categoryClassGroup?: RentalHousingCategoryClassGroup
    categoryType?: RentalHousingCategoryTypes
    searchResultUnits?: FormValue[]
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
    fireExtinguishers?: string
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

export type SelectOption = {
  value: string
  label: {
    id: string
    defaultMessage: string
    description: string
  }
}
