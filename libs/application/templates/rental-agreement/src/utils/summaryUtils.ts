import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { Application } from '@island.is/api/schema'
import { UploadFile } from '@island.is/island-ui/core'
import { FormValue } from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from './enums'
import { AddressProps, CostField, SelectOption, Unit } from './types'

// Utility function to get the label of a select option based on its value
export const getOptionLabel = (
  value: string,
  getOptions: () => SelectOption[],
  defaultValue: '',
): string => {
  if (!value) {
    return defaultValue
  }
  const options = getOptions()
  const matchingOption = options.find((option) => option.value === value)
  return matchingOption ? matchingOption.label.defaultMessage : defaultValue
}

// Other Fees application answers
export const extractOtherFeesData = (answers: Application['answers']) => {
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
export const extractPropertyInfoData = (answers: Application['answers']) => {
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
    searchResultLabel: getValueViaPath<string>(
      answers,
      'registerProperty.searchresults.label',
    ),
    searchResultUnits:
      getValueViaPath<Unit[]>(
        answers,
        'registerProperty.searchresults.units',
      ) || [],
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
    fireExtinguisher: getValueViaPath<string>(
      answers,
      'fireProtections.fireExtinguisher',
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

// Rental info application answers
export const extractRentalInfoData = (answers: Application['answers']) => {
  return {
    securityDepositRequired: getValueViaPath<YesOrNoEnum>(
      answers,
      'rentalAmount.securityDepositRequired',
    ),
    isSecurityDepositType: getValueViaPath<SecurityDepositTypeOptions>(
      answers,
      'securityDeposit.securityType',
    ),
    searchResults: getValueViaPath<AddressProps>(
      answers,
      'registerProperty.searchresults',
    ),
    searchResultUnits: getValueViaPath<FormValue[]>(
      answers,
      'registerProperty.searchresults.units',
    ),
    startDate: getValueViaPath<string>(answers, 'rentalPeriod.startDate'),
    endDate: getValueViaPath<string>(answers, 'rentalPeriod.endDate'),
    isDefinite: getValueViaPath<string>(answers, 'rentalPeriod.isDefinite'),
    rentalAmount: getValueViaPath<string>(answers, 'rentalAmount.amount'),
    paymentDateOptions: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentDateOptions',
    ),
    paymentMethodOptions: getValueViaPath<RentalPaymentMethodOptions>(
      answers,
      'rentalAmount.paymentMethodOptions',
    ),
    paymentMethodNationalId: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodNationalId',
    ),
    paymentMethodAccountNumber: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodBankAccountNumber',
    ),
    paymentMethodOtherTextField: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodOtherTextField',
    ),
    indexConnected: getValueViaPath<YesOrNoEnum>(
      answers,
      'rentalAmount.isIndexConnected',
    ),
    indexTypes: getValueViaPath<string>(answers, 'rentalAmount.indexTypes'),
    securityAmountCalculated: getValueViaPath<string>(
      answers,
      'securityDeposit.securityAmountCalculated',
    ),
    securityAmountOther: getValueViaPath<string>(
      answers,
      'securityDeposit.securityAmountOther',
    ),
    securityType: getValueViaPath<SecurityDepositTypeOptions>(
      answers,
      'securityDeposit.securityType',
    ),
    bankGuaranteeInfo: getValueViaPath<string>(
      answers,
      'securityDeposit.bankGuaranteeInfo',
    ),
    thirdPartyGuaranteeInfo: getValueViaPath<string>(
      answers,
      'securityDeposit.thirdPartyGuaranteeInfo',
    ),
    insuranceCompanyInfo: getValueViaPath<string>(
      answers,
      'securityDeposit.insuranceCompanyInfo',
    ),
    mutualFundInfo: getValueViaPath<string>(
      answers,
      'securityDeposit.mutualFundInfo',
    ),
    otherInfo: getValueViaPath<string>(answers, 'securityDeposit.otherInfo'),
  }
}
