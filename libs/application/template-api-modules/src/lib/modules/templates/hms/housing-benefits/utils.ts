import { Contract } from '@island.is/clients/hms-rental-agreement'

export const normalizeNationalId = (nationalId: string): string =>
  nationalId.replace(/\D/g, '').slice(-10)

export const isApplicantTenantOnContract = (
  contract: Contract,
  applicantNationalId: string,
): boolean => {
  const normalizedApplicant = normalizeNationalId(applicantNationalId)
  return (
    contract.contractParty?.some(
      (party) =>
        party.partyTypeUseCode === 'TENANT' &&
        party.kennitala &&
        normalizeNationalId(party.kennitala) === normalizedApplicant,
    ) ?? false
  )
}

export const isContractValidForHousingBenefits = (
  contract: Contract,
): boolean => {
  if (contract.contractTypeUseCode === 'INDEFINETEAGREEMENT') {
    return true
  }
  if (!contract.dateTo) {
    return false
  }
  const endDate = new Date(contract.dateTo)
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  return endDate >= threeMonthsFromNow
}

export const filterContractsForHousingBenefits = (
  contracts: Contract[],
  applicantNationalId: string,
): Contract[] =>
  contracts.filter(
    (contract) =>
      isApplicantTenantOnContract(contract, applicantNationalId) &&
      isContractValidForHousingBenefits(contract),
  )
