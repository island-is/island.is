import {
  ContractDraftRequest,
  PartyContact,
  PropertyUnit,
  BankAccountNumber,
  OtherCostItem,
} from '@island.is/clients/hms-rental-agreement'
import {
  ApplicantsInfo,
  BankAccount,
  CostField,
  DraftAnswers,
  DraftPartyContact,
  DraftPropertyUnit,
} from '@island.is/application/templates/hms/rental-agreement'

export const mapDraftToContractRequest = (
  draft: DraftAnswers,
): ContractDraftRequest => {
  const mapToPartyContact = (
    applicant: ApplicantsInfo | DraftPartyContact,
  ): PartyContact => ({
    nationalIdWithName: applicant.nationalIdWithName,
    phone: applicant.phone,
    email: applicant.email,
    address: 'address' in applicant ? applicant.address : undefined,
  })

  const mapToPropertyUnit = (unit: DraftPropertyUnit): PropertyUnit => ({
    size: unit.size ?? 0,
    address: unit.address ?? null,
    checked: unit.checked ?? null,
    sizeUnit: unit.sizeUnit ?? null,
    unitCode: unit.unitCode ?? null,
    numOfRooms: unit.numOfRooms ?? null,
    addressCode: unit.addressCode ?? 0,
    changedSize: unit.changedSize ?? null,
    propertyCode: unit.propertyCode ?? 0,
    propertyValue: unit.propertyValue ?? 0,
    appraisalUnitCode: unit.appraisalUnitCode ?? 0,
    fireInsuranceValuation: unit.fireInsuranceValuation ?? 0,
    propertyUsageDescription: unit.propertyUsageDescription ?? null,
  })

  const mapToBankAccountNumber = (
    bankAccount: BankAccount,
  ): BankAccountNumber => ({
    bankNumber: bankAccount.bankNumber,
    ledger: bankAccount.ledger,
    accountNumber: bankAccount.accountNumber,
  })

  const mapToOtherCostItem = (costField: CostField): OtherCostItem => ({
    description: costField.description,
    amount: costField.amount?.toString() ?? null,
  })

  return {
    contractId: draft.contractId,
    signingParties: draft.signingParties.map(mapToPartyContact),
    landlords: draft.landlords.map(mapToPartyContact),
    landlordRepresentatives:
      draft.landlordRepresentatives.map(mapToPartyContact),
    tenants: draft.tenants.map(mapToPartyContact),
    units: draft.units.map(mapToPropertyUnit),
    startDate: draft.startDate,
    endDate: draft.endDate,
    amount: draft.amount,
    isIndexConnected: draft.isIndexConnected,
    indexDate: draft.indexDate,
    indexRate: draft.indexRate,
    paymentMethodOther: draft.paymentMethodOther,
    paymentDateOptions: draft.paymentDateOptions,
    paymentDayOther: draft.paymentDayOther,
    paymentMethodOptions: draft.paymentMethodOptions,
    paymentMethodBankAccountNumber: mapToBankAccountNumber(
      draft.paymentMethodBankAccountNumber,
    ),
    securityDepositRequired: [draft.securityDepositRequired],
    securityType: draft.securityType,
    bankGuaranteeInfo: draft.bankGuaranteeInfo,
    thirdPartyGuaranteeInfo: draft.thirdPartyGuaranteeInfo,
    insuranceCompanyInfo: draft.insuranceCompanyInfo,
    mutualFundInfo: draft.mutualFundInfo,
    otherInfo: draft.otherInfo,
    securityDepositAmount: draft.securityDepositAmount,
    securityAmountOther: draft.securityAmountOther,
    securityAmountCalculated: draft.securityAmountCalculated,
    categoryType: draft.categoryType,
    categoryClass: draft.categoryClass,
    categoryClassGroup: draft.categoryClassGroup,
    description: draft.description,
    rules: draft.rules,
    conditionDescription: draft.conditionDescription,
    inspector: draft.inspector,
    inspectorName: draft.inspectorName,
    smokeDetectors: draft.smokeDetectors,
    fireExtinguisher: draft.fireExtinguisher,
    fireBlanket: draft.fireBlanket,
    emergencyExits: draft.emergencyExits,
    housingFundPayee: draft.housingFundPayee,
    housingFundAmount: draft.housingFundAmount,
    electricityCostPayee: draft.electricityCostPayee,
    electricityCostMeterStatusDate: draft.electricityCostMeterStatusDate,
    electricityCostMeterNumber: draft.electricityCostMeterNumber,
    electricityCostMeterStatus: draft.electricityCostMeterStatus,
    heatingCostPayee: draft.heatingCostPayee,
    heatingCostMeterStatusDate: draft.heatingCostMeterStatusDate,
    heatingCostMeterNumber: draft.heatingCostMeterNumber,
    heatingCostMeterStatus: draft.heatingCostMeterStatus,
    otherCostPayedByTenant: [draft.otherCostPayedByTenant],
    otherCostItems: draft.otherCostItems.map(mapToOtherCostItem),
  }
}
