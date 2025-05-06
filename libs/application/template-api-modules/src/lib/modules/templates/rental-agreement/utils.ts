import { Application, ApplicationFileInput } from '@island.is/api/schema'
import { AddressProps, ApplicantsInfo, CostField, Unit } from './types'
import { getValueViaPath } from '@island.is/application/core'

export const filterNonRepresentativesAndMapInfo = (
  applicants: Array<ApplicantsInfo> = [],
) => {
  return applicants
    .filter(
      ({ isRepresentative }) => !isRepresentative?.includes('isRepresentative'),
    )
    .map((applicant) => ({
      name: applicant.nationalIdWithName.name,
      address: applicant.email,
    }))
}

export const applicationAnswers = (answers: Application['answers']) => {
  return {
    landlords: getValueViaPath<ApplicantsInfo[]>(answers, 'landlordInfo.table'),
    tenants: getValueViaPath<ApplicantsInfo[]>(answers, 'tenantInfo.table'),
    searchResults: getValueViaPath<AddressProps>(
      answers,
      'registerProperty.searchresults',
    ),
    units: getValueViaPath<Unit[]>(
      answers,
      'registerProperty.searchresults.units',
    ),
    categoryType: getValueViaPath(answers, 'registerProperty.categoryType'),
    categoryClass: getValueViaPath(answers, 'registerProperty.categoryClass'),
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
    fireBlankets: getValueViaPath<string>(
      answers,
      'fireProtections.fireBlankets',
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
    rentalAmount: getValueViaPath<string>(answers, 'rentalAmount.amount'),
    isIndexConnected: getValueViaPath<string>(
      answers,
      'rentalAmount.indexConnected',
    ),
    indexType: getValueViaPath<string>(answers, 'rentalAmount.indexTypes'),
    indexRate: getValueViaPath<string>(answers, 'rentalAmount.indexRate'),
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
  }
}
