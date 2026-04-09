import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import { isFileUploaded } from './utils'

const normalizeForComparison = (
  val: string | number | null | undefined,
): string =>
  String(val ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

/**
 * Gets the contract selected in rentalAgreement.answer
 */
export const getSelectedContract = (
  answers: FormValue,
  externalData: ExternalData,
): Contract | undefined => {
  const selectedContractId = getValueViaPath<string | number>(
    answers,
    'rentalAgreement.answer',
  )
  if (selectedContractId === undefined || selectedContractId === '') {
    return undefined
  }
  const selectedNormalized = String(selectedContractId).trim()

  const contractsRaw = getValueViaPath<unknown>(
    externalData,
    'getRentalAgreements.data',
  )
  const contracts = Array.isArray(contractsRaw) ? contractsRaw : []

  return (contracts as Contract[]).find((c) => {
    const id = c.contractId
    if (id === undefined || id === null) return false
    return String(id).trim() === selectedNormalized
  })
}

/**
 * Checks if the National Registry address matches the selected rental contract address
 */
export const doesAddressMatchRentalContract = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const nationalRegistryAddress = getValueViaPath<{
    streetAddress?: string | null
    postalCode?: string | null
    locality?: string | null
  }>(externalData, 'nationalRegistry.data.address')

  const contract = getSelectedContract(answers, externalData)
  const contractProperty = contract?.contractProperty?.[0]

  if (!nationalRegistryAddress || !contractProperty) {
    return false
  }

  const registryStreet = normalizeForComparison(
    nationalRegistryAddress.streetAddress,
  )
  const registryPostalCode = normalizeForComparison(
    nationalRegistryAddress.postalCode,
  )
  const contractStreet = normalizeForComparison(
    contractProperty.streetAndHouseNumber,
  )
  const contractPostalCode = normalizeForComparison(contractProperty.postalCode)

  return (
    registryStreet === contractStreet &&
    registryPostalCode === contractPostalCode
  )
}

/**
 * Checks if the assignee's National Registry address matches the selected rental contract address.
 * Assignee data is stored under dynamic keys: `<nationalId>.assigneeNationalRegistry`.
 */
export const doesAssigneeAddressMatchRentalContract = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  let assigneeAddress: {
    streetAddress?: string | null
    postalCode?: string | null
  } | null = null
  for (const [key, value] of Object.entries(externalData)) {
    if (key.endsWith('.assigneeNationalRegistry') && value?.data) {
      assigneeAddress =
        ((value.data as Record<string, unknown>)?.address as {
          streetAddress?: string | null
          postalCode?: string | null
        }) ?? null
      break
    }
  }

  const contract = getSelectedContract(answers, externalData)
  const contractProperty = contract?.contractProperty?.[0]

  if (!assigneeAddress || !contractProperty) {
    return false
  }

  const registryStreet = normalizeForComparison(assigneeAddress?.streetAddress)
  const registryPostalCode = normalizeForComparison(assigneeAddress?.postalCode)
  const contractStreet = normalizeForComparison(
    contractProperty.streetAndHouseNumber,
  )
  const contractPostalCode = normalizeForComparison(contractProperty.postalCode)

  return (
    registryStreet === contractStreet &&
    registryPostalCode === contractPostalCode
  )
}

/**
 * Gets rental agreements that qualify for housing benefits.
 * Filtering (applicant as tenant, unbound or 3+ months left) is done by the API.
 */
export const getRentalAgreementsForHousingBenefits = (
  application: Application,
): Contract[] => {
  const contracts = getValueViaPath<Contract[]>(
    application?.externalData,
    'getRentalAgreements.data',
  )
  return Array.isArray(contracts) ? contracts : []
}

export const hasRentalAgreements = (application: Application) =>
  getRentalAgreementsForHousingBenefits(application).length > 0

/**
 * Gets the landlord selected for payment (when benefits go to landlord).
 * Returns name and nationalId for the overview display.
 */
export const getSelectedLandlordForPayment = (
  answers: FormValue,
  externalData: ExternalData,
): { name: string; nationalId: string } | null => {
  const contract = getSelectedContract(answers, externalData)
  const landlords = contract?.contractParty?.filter(
    (p) => p.partyTypeUseCode === 'OWNER' && (p.kennitala || p.name),
  )
  if (!landlords?.length) return null

  const selectedValue = getValueViaPath<string>(
    answers,
    'payment.landlordSelection',
  )

  if (selectedValue) {
    const landlord = landlords.find(
      (p) =>
        p.kennitala === selectedValue ||
        p.contractPartyId?.toString() === selectedValue,
    )
    return landlord
      ? {
          name: landlord.name ?? 'Leigusali',
          nationalId: landlord.kennitala ?? '',
        }
      : null
  }

  if (landlords.length === 1) {
    const p = landlords[0]
    return { name: p.name ?? 'Leigusali', nationalId: p.kennitala ?? '' }
  }

  return null
}

/**
 * Gets landlord options from the selected contract for the payment section.
 * Returns options for each landlord (partyTypeUseCode === 'OWNER') on the contract.
 */
export const getLandlordOptionsForSelectedContract = (
  application: Application,
): Array<{ value: string; label: string }> => {
  const contract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  const landlords = contract?.contractParty?.filter(
    (p) => p.partyTypeUseCode === 'OWNER' && (p.kennitala || p.name),
  )
  if (!landlords?.length) return []
  return landlords.map((p) => ({
    value: p.kennitala ?? p.contractPartyId?.toString() ?? '',
    label: p.name ?? 'Leigusali',
  }))
}

/**
 * Gets renters from the selected contract for display in the household members table repeater.
 * Returns flat { name, nationalId, custodyAgreementFile } for table display. The nationalIdWithName component
 * stores nested format; handleCustomMappedValues flattens it for display.
 */
export const getHouseholdMembersForTable = (
  application: Application,
): Record<string, string>[] => {
  const contract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  const tenants = contract?.contractParty?.filter(
    (p) => p.partyTypeUseCode === 'TENANT' && p.kennitala,
  )

  if (!tenants?.length) {
    return []
  }

  const fileUploaded = isFileUploaded(application.answers)

  if (fileUploaded) {
    return tenants.map((p) => ({
      name: p.name ?? '',
      nationalId: p.kennitala ?? '',
      file: '',
    }))
  }

  return tenants.map((p) => ({
    name: p.name ?? '',
    nationalId: p.kennitala ?? '',
  }))
}
