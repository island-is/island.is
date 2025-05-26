import { Application, ApplicationFileInput } from '@island.is/api/schema'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { ApplicantsInfo, CostField } from './types'
import { AddressProps, Unit } from '../utils/types'
import { NextStepInReviewOptions } from '../utils/enums'

export const applicationAnswers = (answers: Application['answers']) => {
  return {
    landlords:
      getValueViaPath<ApplicantsInfo[]>(answers, 'landlordInfo.table', []) ??
      [],
    tenants:
      getValueViaPath<ApplicantsInfo[]>(answers, 'tenantInfo.table', []) ?? [],
    searchResults: getValueViaPath<AddressProps>(
      answers,
      'registerProperty.searchresults',
    ),
    searchResultLabel: getValueViaPath<string>(
      answers,
      'registerProperty.searchresults.label',
    ),
    units:
      getValueViaPath<Unit[]>(
        answers,
        'registerProperty.searchresults.units',
      ) || [],
    categoryType: getValueViaPath<string>(
      answers,
      'registerProperty.categoryType',
    ),
    categoryClass: getValueViaPath<string>(
      answers,
      'registerProperty.categoryClass',
    ),
    categoryClassGroup: getValueViaPath<string>(
      answers,
      'registerProperty.categoryClassGroup',
    ),
    description: getValueViaPath<string>(
      answers,
      'specialProvisions.descriptionInput',
    ),
    rules: getValueViaPath<string>(answers, 'specialProvisions.rulesInput'),
    conditionDescription: getValueViaPath<string>(
      answers,
      'condition.resultsDescription',
    ),
    inspector: getValueViaPath<string>(answers, 'condition.inspector'),
    inspectorName: getValueViaPath<string>(answers, 'condition.inspectorName'),
    files: getValueViaPath<ApplicationFileInput[]>(
      answers,
      'condition.resultsFiles',
    ),
    fireBlanket: getValueViaPath<string>(
      answers,
      'fireProtections.fireBlanket',
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
    startDate: getValueViaPath<string>(answers, 'rentalPeriod.startDate'),
    endDate: getValueViaPath<string>(answers, 'rentalPeriod.endDate'),
    isDefinite: getValueViaPath<string>(answers, 'rentalPeriod.isDefinite'),
    rentalAmount: getValueViaPath<string>(answers, 'rentalAmount.amount'),
    isIndexConnected: getValueViaPath<string>(
      answers,
      'rentalAmount.isIndexConnected',
    ),
    indexType: getValueViaPath<string>(answers, 'rentalAmount.indexTypes'),
    paymentMethod: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodOptions',
    ),
    paymentMethodOther: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodOtherTextField',
    ),
    paymentDay: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentDateOptions',
    ),
    paymentDayOther: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentDateOther',
    ),
    bankAccountNumber: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodBankAccountNumber',
    ),
    nationalIdOfAccountOwner: getValueViaPath<string>(
      answers,
      'rentalAmount.paymentMethodNationalId',
    ),
    securityDepositRequired: getValueViaPath<YesOrNoEnum>(
      answers,
      'rentalAmount.securityDepositRequired',
    ),
    securityDepositType: getValueViaPath<string>(
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
    landlordsMutualFundInfo: getValueViaPath<string>(
      answers,
      'securityDeposit.landlordsMutualFundInfo',
    ),
    otherInfo: getValueViaPath<string>(answers, 'securityDeposit.otherInfo'),
    securityDepositAmount: getValueViaPath<string>(
      answers,
      'securityDeposit.securityAmount',
    ),
    securityDepositAmountOther: getValueViaPath<string>(
      answers,
      'securityDeposit.securityAmountOther',
    ),
    securityAmountCalculated: getValueViaPath<string>(
      answers,
      'securityDeposit.securityAmountCalculated',
    ),
    housingFundPayee: getValueViaPath<string>(answers, 'otherFees.housingFund'),
    housingFundAmount: getValueViaPath<string>(
      answers,
      'otherFees.housingFundAmount',
    ),
    electricityCostPayee: getValueViaPath<string>(
      answers,
      'otherFees.electricityCost',
    ),
    electricityCostMeterStatusDate: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterStatusDate',
    ),
    electricityCostMeterNumber: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterNumber',
    ),
    electricityCostMeterStatus: getValueViaPath<string>(
      answers,
      'otherFees.electricityCostMeterStatus',
    ),
    heatingCostPayee: getValueViaPath<string>(answers, 'otherFees.heatingCost'),
    heatingCostMeterStatusDate: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterStatusDate',
    ),
    heatingCostMeterNumber: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterNumber',
    ),
    heatingCostMeterStatus: getValueViaPath<string>(
      answers,
      'otherFees.heatingCostMeterStatus',
    ),
    otherCostItems: getValueViaPath<CostField[]>(
      answers,
      'otherFees.otherCostItems',
    ),
    nextStepInReviewOptions: getValueViaPath<NextStepInReviewOptions>(
      answers,
      'reviewInfo.applicationReview.nextStepOptions',
    ),
  }
}
