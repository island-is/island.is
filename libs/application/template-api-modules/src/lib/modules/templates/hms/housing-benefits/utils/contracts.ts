import { Contract } from '@island.is/clients/hms-rental-agreement'
import { Address } from '@island.is/application/types'
import { normalizeNationalId } from './application'

const normalizeForAddressComparison = (
  val: string | number | null | undefined,
): string =>
  String(val ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

export const getContractAddressKey = (contract: Contract): string => {
  const prop = contract.contractProperty?.[0]
  if (!prop) return ''
  return [
    normalizeForAddressComparison(prop.streetAndHouseNumber),
    normalizeForAddressComparison(prop.postalCode),
  ].join('|')
}

/** Legal domicile in National Registry vs contract property. */
export const doesDomicileAddressMatchContractProperty = (
  address: Pick<Address, 'streetAddress' | 'postalCode'> | null,
  property: NonNullable<Contract['contractProperty']>[number],
): boolean => {
  if (!address) {
    return false
  }
  return (
    normalizeForAddressComparison(address.streetAddress) ===
      normalizeForAddressComparison(property.streetAndHouseNumber) &&
    normalizeForAddressComparison(address.postalCode) ===
      normalizeForAddressComparison(property.postalCode)
  )
}

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

export const MIN_CONTRACT_LENGTH_MONTHS = 3

/** Parses a contract date to UTC midnight so comparisons are by calendar day only. */
const toUtcDay = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (match) {
    return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]))
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
    ),
  )
}

/** Adds calendar months, clamping to the last day of the target month (e.g. 30 Nov + 3 → 28 Feb). */
const addUtcMonthsClamped = (date: Date, months: number): Date => {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + months
  const lastDayOfTargetMonth = new Date(
    Date.UTC(year, month + 1, 0),
  ).getUTCDate()
  return new Date(
    Date.UTC(year, month, Math.min(date.getUTCDate(), lastDayOfTargetMonth)),
  )
}

/**
 * Indefinite agreements always qualify. Definite agreements must not have ended
 * and must span at least {@link MIN_CONTRACT_LENGTH_MONTHS} months from `dateFrom`
 * to `dateTo`, both days inclusive (e.g. 1 Jan – 31 Mar qualifies), regardless of
 * how much time is left on the agreement today.
 */
export const isContractValidForHousingBenefits = (
  contract: Contract,
): boolean => {
  if (contract.contractTypeUseCode === 'INDEFINETEAGREEMENT') {
    return true
  }
  if (!contract.dateFrom || !contract.dateTo) {
    return false
  }
  const startDate = toUtcDay(contract.dateFrom)
  const endDate = toUtcDay(contract.dateTo)
  if (!startDate || !endDate) {
    return false
  }

  const now = new Date()
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
  if (endDate < today) {
    return false
  }

  const minimumEndDate = addUtcMonthsClamped(
    startDate,
    MIN_CONTRACT_LENGTH_MONTHS,
  )
  minimumEndDate.setUTCDate(minimumEndDate.getUTCDate() - 1)
  return endDate >= minimumEndDate
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
