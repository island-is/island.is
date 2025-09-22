import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  ApplicantsInfo,
  PropertyUnit,
  CostField,
  AddressProps,
  ParticipantsSection,
  PropertySection,
  RentalAgreementAnswers,
  ReviewSection,
  OtherFeesSection,
  SecurityDepositSection,
  RentalAmountSection,
  RentalPeriodSection,
  FireProtectionSection,
  ProvisionsAndConditionSection,
  Files,
  LandlordInfo,
  BankAccount,
} from './types'
import { NextStepInReviewOptions } from '../utils/enums'

const mapLandLordInfo = (landlord: LandlordInfo): ApplicantsInfo => {
  return {
    nationalIdWithName: landlord.nationalIdWithName,
    phone: landlord.phone,
    email: landlord.email,
    address: '',
    isRepresentative: landlord.isRepresentative?.includes('✔️'),
  }
}

const extractParticipants = (
  answers: Application['answers'],
): ParticipantsSection => {
  const landlordsAndRepresentatives =
    getValueViaPath<LandlordInfo[]>(
      answers,
      'parties.landlordInfo.table',
      [],
    ) ?? []
  const landlords = landlordsAndRepresentatives.map(mapLandLordInfo)
  return {
    landlords,
    tenants:
      getValueViaPath<ApplicantsInfo[]>(
        answers,
        'parties.tenantInfo.table',
        [],
      ) ?? [],
  }
}

const extractPropertyInfo = (
  answers: Application['answers'],
): PropertySection => ({
  searchResults: getValueViaPath<AddressProps>(
    answers,
    'registerProperty.searchresults',
  ),
  searchResultLabel: getValueViaPath<string>(
    answers,
    'registerProperty.searchresults.label',
  ),
  units:
    getValueViaPath<PropertyUnit[]>(
      answers,
      'registerProperty.searchresults.units',
    ) ?? [],
  categoryType: getValueViaPath<string>(answers, 'propertyInfo.categoryType'),
  categoryClass: getValueViaPath<string>(answers, 'propertyInfo.categoryClass'),
  categoryClassGroup: getValueViaPath<string>(
    answers,
    'propertyInfo.categoryClassGroup',
  ),
})

const extractProvisionsAndCondition = (
  answers: Application['answers'],
): ProvisionsAndConditionSection => ({
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
  files: getValueViaPath<Files[]>(answers, 'condition.resultsFiles'),
})

const extractFireProtection = (
  answers: Application['answers'],
): FireProtectionSection => ({
  fireBlanket: getValueViaPath<string>(answers, 'fireProtections.fireBlanket'),
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
})

const extractRentalPeriod = (
  answers: Application['answers'],
): RentalPeriodSection => ({
  startDate: getValueViaPath<string>(answers, 'rentalPeriod.startDate'),
  endDate: getValueViaPath<string>(answers, 'rentalPeriod.endDate'),
  isDefinite: getValueViaPath<string>(answers, 'rentalPeriod.isDefinite'),
})

const extractRentalAmount = (
  answers: Application['answers'],
): RentalAmountSection => ({
  amount: getValueViaPath<string>(answers, 'rentalAmount.amount'),
  isIndexConnected: getValueViaPath<Array<YesOrNoEnum>>(
    answers,
    'rentalAmount.isIndexConnected',
  ),
  indexDate: getValueViaPath<string>(answers, 'rentalAmount.indexDate'),
  indexRate: getValueViaPath<string>(answers, 'rentalAmount.indexRate'),
  paymentMethodOptions: getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodOptions',
  ),
  paymentMethodOther: getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodOtherTextField',
  ),
  paymentDateOptions: getValueViaPath<string>(
    answers,
    'rentalAmount.paymentDateOptions',
  ),
  paymentDayOther: getValueViaPath<string>(
    answers,
    'rentalAmount.paymentDateOther',
  ),
  paymentMethodBankAccountNumber: getValueViaPath<BankAccount>(
    answers,
    'rentalAmount.paymentMethodBankAccountNumber',
  ),
  paymentMethodNationalId: getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodNationalId',
  ),
  securityDepositRequired: getValueViaPath<YesOrNoEnum>(
    answers,
    'rentalAmount.securityDepositRequired',
  ),
})

const extractSecurityDeposit = (
  answers: Application['answers'],
): SecurityDepositSection => ({
  securityType: getValueViaPath<string>(
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
    'securityDeposit.mutualFundInfo',
  ),
  otherInfo: getValueViaPath<string>(answers, 'securityDeposit.otherInfo'),
  securityDepositAmount: getValueViaPath<string>(
    answers,
    'securityDeposit.securityAmount',
  ),
  securityAmountOther: getValueViaPath<string>(
    answers,
    'securityDeposit.securityAmountOther',
  ),
  securityAmountCalculated: getValueViaPath<string>(
    answers,
    'securityDeposit.securityAmountCalculated',
  ),
  securityAmountHiddenRentalAmount: getValueViaPath<string>(
    answers,
    'securityDeposit.rentalAmount',
  ),
})

const extractOtherFees = (
  answers: Application['answers'],
): OtherFeesSection => ({
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
  otherCostPayedByTenant: getValueViaPath<YesOrNoEnum>(
    answers,
    'otherFees.otherCosts',
  ),
  otherCostItems: getValueViaPath<CostField[]>(
    answers,
    'otherFees.otherCostItems',
  ),
})

const extractReview = (answers: Application['answers']): ReviewSection => ({
  nextStepInReviewOptions: getValueViaPath<NextStepInReviewOptions>(
    answers,
    'reviewInfo.applicationReview.nextStepOptions',
  ),
})

export const applicationAnswers = (
  answers: Application['answers'],
): RentalAgreementAnswers => {
  return {
    ...extractParticipants(answers),
    ...extractPropertyInfo(answers),
    ...extractProvisionsAndCondition(answers),
    ...extractFireProtection(answers),
    ...extractRentalPeriod(answers),
    ...extractRentalAmount(answers),
    ...extractSecurityDeposit(answers),
    ...extractOtherFees(answers),
    ...extractReview(answers),
  }
}
