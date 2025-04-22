import { getValueViaPath } from '@island.is/application/core'
import { UploadFile } from '@island.is/island-ui/core'
import { FormValue } from '@island.is/application/types'
import { ApplicationAnswers, CostField, SelectOption } from './types'
import {
  OtherFeesPayeeOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
} from './constants'

// Utility function to get the label of a select option based on its value
export const getOptionLabel = (
  value: string,
  getOptions: () => SelectOption[],
  defaultValue: string = '-',
): string => {
  if (!value) {
    return defaultValue
  }
  const options = getOptions()
  const matchingOption = options.find((option) => option.value === value)
  return matchingOption ? matchingOption.label.defaultMessage : defaultValue
}

// Other Fees application answers
export const extractOtherFeesData = (answers: ApplicationAnswers) => {
  return {
    housingFund: getValueViaPath<OtherFeesPayeeOptions>(
      answers,
      'otherFees.housingFund',
    ),
    electricityCost: getValueViaPath<OtherFeesPayeeOptions>(
      answers,
      'otherFees.electricityCost',
    ),
    heatingCost: getValueViaPath<OtherFeesPayeeOptions>(
      answers,
      'otherFees.heatingCost',
    ),
    otherCosts: getValueViaPath<string>(answers, 'otherFees.otherCostItems'),
    otherCostItems: getValueViaPath<CostField[]>(
      answers,
      'otherFees.otherCostItems',
    ),
    electricityCostMeterStatusDate: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterStatusDate',
    ),
    heatingCostMeterStatusDate: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterStatusDate',
    ),
    housingFundAmount: getValueViaPath<string>(
      answers,
      'otherFees.housingFundAmount',
    ),
    electricityCostMeterNumber: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterNumber',
      '-',
    ),
    electricityCostMeterStatus: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterStatus',
      '-',
    ),
    heatingCostMeterNumber: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterNumber',
      '-',
    ),
    heatingCostMeterStatus: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterStatus',
      '-',
    ),
  }
}

// Property info application answers
export const extractPropertyInfoData = (answers: ApplicationAnswers) => {
  return {
    uploadedFiles: getValueViaPath<UploadFile[]>(
      answers,
      'condition.resultsFiles',
    ),
    categoryClass: getValueViaPath<RentalHousingCategoryClass>(
      answers,
      'registerProperty.categoryClass',
    ),
    categoryClassGroup: getValueViaPath<RentalHousingCategoryClass>(
      answers,
      'registerProperty.categoryClassGroup',
    ),
    categoryType: getValueViaPath<RentalHousingCategoryTypes>(
      answers,
      'registerProperty.categoryType',
    ),
    searchResultUnits: getValueViaPath<FormValue[]>(
      answers,
      'registerProperty.searchresults.units',
    ),
    inspector: getValueViaPath<RentalHousingConditionInspector>(
      answers,
      'condition.inspector',
    ),
    inspectorName: getValueViaPath<string>(answers, 'condition.inspectorName'),
    resultsDescription: getValueViaPath<string>(
      answers,
      'condition.resultsDescription',
    ),
    descriptionInput: getValueViaPath<string>(
      answers,
      'specialProvisions.descriptionInput',
    ),
    rulesInput: getValueViaPath<string>(
      answers,
      'specialProvisions.rulesInput',
    ),
    smokeDetectors: getValueViaPath<string>(
      answers,
      'fireProtections.smokeDetectors',
    ),
    fireExtinguishers: getValueViaPath<string>(
      answers,
      'fireProtections.fireExtinguishers',
    ),
    emergencyExits: getValueViaPath<string>(
      answers,
      'fireProtections.emergencyExits',
    ),
    fireBlanket: getValueViaPath<string>(
      answers,
      'fireProtections.fireBlanket',
    ),
  }
}
