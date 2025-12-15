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
  BankAccount,
  AnswerApplicant,
  DraftAnswers,
  DraftPropertyUnit,
} from './types'
import { ApplicantsRole, NextStepInReviewOptions } from '../utils/enums'
import { isCompany } from 'kennitala'

const mapParticipantInfo = (participant: ApplicantsInfo): ApplicantsInfo => {
  return {
    nationalIdWithName: participant.nationalIdWithName,
    phone: participant.phone,
    email: participant.email,
    address: participant.address,
  }
}

const extractParticipants = (
  answers: Application['answers'],
): ParticipantsSection => {
  const applicantRole = getValueViaPath<string>(
    answers,
    'parties.applicantsRole',
  )

  const applicant =
    getValueViaPath<AnswerApplicant>(answers, 'parties.applicant') ||
    ({} as AnswerApplicant)

  const mappedApplicant = mapParticipantInfo({
    nationalIdWithName: {
      name: applicant.name,
      nationalId: applicant.nationalId,
    },
    phone: applicant.phoneNumber,
    email: applicant.email,
    address: applicant.address,
  })

  let representatives = getValueViaPath<Array<ApplicantsInfo | string>>(
    answers,
    'parties.landlordInfo.representativeTable',
  )

  if (
    !representatives ||
    representatives.length === 0 ||
    typeof representatives[0] === 'string' ||
    (typeof representatives[0] === 'object' &&
      representatives[0]?.nationalIdWithName?.nationalId === '')
  ) {
    representatives = []
  }

  const landlordRepresentatives = (
    representatives as Array<ApplicantsInfo>
  ).map(mapParticipantInfo)
  const landlords = (
    getValueViaPath<ApplicantsInfo[]>(answers, 'parties.landlordInfo.table') ||
    []
  ).map(mapParticipantInfo)

  const tenants = (
    getValueViaPath<ApplicantsInfo[]>(answers, 'parties.tenantInfo.table') || []
  ).map(mapParticipantInfo)

  switch (applicantRole) {
    case ApplicantsRole.LANDLORD:
      landlords.push(mappedApplicant)
      break
    case ApplicantsRole.REPRESENTATIVE:
      landlordRepresentatives.push(mappedApplicant)
      break
    case ApplicantsRole.TENANT:
    default:
      tenants.push(mappedApplicant)
      break
  }

  const signingParties = []

  if (isCompany(applicant.nationalId ?? '')) {
    const signatory = mapParticipantInfo(
      getValueViaPath<ApplicantsInfo>(answers, 'parties.signatory') ??
        ({} as ApplicantsInfo),
    )
    signingParties.push(...tenants, signatory)
  } else {
    signingParties.push(...tenants, ...landlords)
  }

  return {
    landlords,
    landlordRepresentatives,
    tenants,
    signingParties,
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
    ) || [],
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
  mutualFundInfo: getValueViaPath<string>(
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
  otherCostItems:
    getValueViaPath<CostField[]>(answers, 'otherFees.otherCostItems') || [],
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

export const draftAnswers = (
  answers: RentalAgreementAnswers,
  contractId: string,
): DraftAnswers => {
  return {
    contractId,
    landlords: answers.landlords,
    landlordRepresentatives: answers.landlordRepresentatives,
    tenants: answers.tenants,
    signingParties: answers.signingParties,
    units: answers.units as DraftPropertyUnit[],
    startDate: answers.startDate ?? '',
    endDate: answers.endDate ?? '',
    amount: answers.amount ?? '',
    isIndexConnected: answers.isIndexConnected || [],
    indexDate: answers.indexDate ?? '',
    indexRate: answers.indexRate ?? '',
    paymentMethodOther: answers.paymentMethodOther,
    paymentDateOptions: answers.paymentDateOptions ?? '',
    paymentDayOther: answers.paymentDayOther,
    paymentMethodOptions: answers.paymentMethodOptions ?? '',
    paymentMethodBankAccountNumber:
      answers.paymentMethodBankAccountNumber ?? ({} as BankAccount),
    securityDepositRequired: answers.securityDepositRequired ?? YesOrNoEnum.NO,
    securityType: answers.securityType ?? '',
    bankGuaranteeInfo: answers.bankGuaranteeInfo ?? '',
    thirdPartyGuaranteeInfo: answers.thirdPartyGuaranteeInfo ?? '',
    insuranceCompanyInfo: answers.insuranceCompanyInfo ?? '',
    mutualFundInfo: answers.mutualFundInfo ?? '',
    otherInfo: answers.otherInfo ?? '',
    securityDepositAmount: answers.securityDepositAmount ?? '',
    securityAmountOther: answers.securityAmountOther ?? '',
    securityAmountCalculated: answers.securityAmountCalculated ?? '',
    categoryType: answers.categoryType ?? '',
    categoryClass: answers.categoryClass ?? '',
    categoryClassGroup: answers.categoryClassGroup ?? '',
    description: answers.description ?? '',
    rules: answers.rules ?? '',
    conditionDescription: answers.conditionDescription ?? '',
    inspector: answers.inspector ?? '',
    inspectorName: answers.inspectorName,
    smokeDetectors: answers.smokeDetectors ?? '',
    fireExtinguisher: answers.fireExtinguisher ?? '',
    fireBlanket: answers.fireBlanket ?? '',
    emergencyExits: answers.emergencyExits ?? '',
    housingFundPayee: answers.housingFundPayee ?? '',
    housingFundAmount: answers.housingFundAmount,
    electricityCostPayee: answers.electricityCostPayee ?? '',
    electricityCostMeterStatusDate: answers.electricityCostMeterStatusDate,
    electricityCostMeterNumber: answers.electricityCostMeterNumber,
    electricityCostMeterStatus: answers.electricityCostMeterStatus,
    heatingCostPayee: answers.heatingCostPayee ?? '',
    heatingCostMeterStatusDate: answers.heatingCostMeterStatusDate,
    heatingCostMeterNumber: answers.heatingCostMeterNumber,
    heatingCostMeterStatus: answers.heatingCostMeterStatus,
    otherCostPayedByTenant: answers.otherCostPayedByTenant ?? YesOrNoEnum.NO,
    otherCostItems: answers.otherCostItems || [], // '' is not nullish
  }
}
