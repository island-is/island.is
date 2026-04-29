import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformationV3,
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import { BffUser } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import { isFileUploaded } from './utils'

type AssigneeNationalRegistryProvider = {
  status?: 'failure' | 'success'
  data?: unknown
}

const getAssigneeRegistryAddressFromProvider = (
  provider: unknown,
): {
  streetAddress?: string | null
  postalCode?: string | null
} | null => {
  const entry = provider as AssigneeNationalRegistryProvider
  if (!entry || entry.status !== 'success' || entry.data == null) {
    return null
  }
  return (
    ((entry.data as Record<string, unknown>)?.address as {
      streetAddress?: string | null
      postalCode?: string | null
    }) ?? null
  )
}

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
 *
 * When `userOrNationalId` is set (BffUser or national id string), only that assignee's provider
 * result is used. Otherwise the first `*.assigneeNationalRegistry` entry is used (e.g. tests).
 * Failed fetches (`status !== 'success'`) never count as a match.
 */
export const doesAssigneeAddressMatchRentalContract = (
  answers: FormValue,
  externalData: ExternalData,
  userOrNationalId?: BffUser | null | string,
): boolean => {
  let assigneeAddress: {
    streetAddress?: string | null
    postalCode?: string | null
  } | null = null

  if (
    typeof userOrNationalId === 'string' &&
    userOrNationalId.trim().length > 0
  ) {
    const normalized = kennitala.isValid(userOrNationalId)
      ? kennitala.sanitize(userOrNationalId)
      : userOrNationalId.trim()
    assigneeAddress = getAssigneeRegistryAddressFromProvider(
      externalData[`${normalized}.assigneeNationalRegistry`],
    )
  } else if (userOrNationalId && typeof userOrNationalId !== 'string') {
    const nationalId = userOrNationalId.profile?.nationalId
    if (nationalId) {
      const normalized = kennitala.isValid(nationalId)
        ? kennitala.sanitize(nationalId)
        : nationalId
      assigneeAddress = getAssigneeRegistryAddressFromProvider(
        externalData[`${normalized}.assigneeNationalRegistry`],
      )
    } else {
      for (const [key, value] of Object.entries(externalData)) {
        if (key.endsWith('.assigneeNationalRegistry')) {
          assigneeAddress = getAssigneeRegistryAddressFromProvider(value)
          break
        }
      }
    }
  } else {
    for (const [key, value] of Object.entries(externalData)) {
      if (key.endsWith('.assigneeNationalRegistry')) {
        assigneeAddress = getAssigneeRegistryAddressFromProvider(value)
        break
      }
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

const normalizeKennitalaKey = (nationalId: string | undefined | null) => {
  if (!nationalId || typeof nationalId !== 'string') return ''
  const trimmed = nationalId.trim()
  if (!trimmed) return ''
  return kennitala.isValid(trimmed) ? kennitala.sanitize(trimmed) : trimmed
}

const displayNationalId = (nationalId: string) => {
  const trimmed = nationalId.trim()
  return kennitala.isValid(trimmed) ? kennitala.sanitize(trimmed) : trimmed
}

/** Renters (tenants) on the selected contract — also used for read-only static table rows. */
export const getRentalAgreementTenantsFlat = (
  application: Application,
): Array<{ name: string; nationalId: string }> => {
  const contract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  const tenants = contract?.contractParty?.filter(
    (p) => p.partyTypeUseCode === 'TENANT' && p.kennitala,
  )
  return (tenants ?? []).map((p) => ({
    name: p.name ?? '',
    nationalId: displayNationalId(p.kennitala ?? ''),
  }))
}

/**
 * `getStaticTableData` shape for the household table: not editable and not deletable
 * (see table repeater documentation).
 */
export const getRentalAgreementTenantsForStaticTable = (
  application: Application,
): Record<string, string>[] => {
  const tenants = getRentalAgreementTenantsFlat(application)
  if (tenants.length === 0) {
    return []
  }
  const fileUploaded = isFileUploaded(application.answers)
  if (fileUploaded) {
    return tenants.map((p) => ({
      name: p.name,
      nationalId: p.nationalId,
      file: '',
    }))
  }
  return tenants.map((p) => ({
    name: p.name,
    nationalId: p.nationalId,
  }))
}

const mergeDomicileAndCustodyExcludingContractTenants = (
  application: Application,
): Array<{ name: string; nationalId: string }> => {
  const tenantKeys = new Set(
    getRentalAgreementTenantsFlat(application).map((m) =>
      normalizeKennitalaKey(m.nationalId),
    ),
  )

  const byKennitala = new Map<string, { name: string; nationalId: string }>()

  const tryAdd = (name: string, nationalId: string | undefined | null) => {
    if (!nationalId) return
    const key = normalizeKennitalaKey(nationalId)
    if (!key || tenantKeys.has(key) || byKennitala.has(key)) return
    byKennitala.set(key, {
      name: name ?? '',
      nationalId: displayNationalId(nationalId),
    })
  }

  const selectedContractId = getValueViaPath<string | number>(
    application.answers,
    'rentalAgreement.answer',
  )
  if (selectedContractId === undefined || selectedContractId === '') {
    return Array.from(byKennitala.values())
  }
  const selectedNormalized = String(selectedContractId).trim()

  const domicilePayload = getValueViaPath<{
    contracts?: Array<{
      contractId: string
      residents: Array<{ nationalId?: string; name?: string | null }>
    }>
  }>(application.externalData, 'getDomicileResidentsByRentalContracts.data')

  const contractDomicile = domicilePayload?.contracts?.find(
    (c) => String(c.contractId).trim() === selectedNormalized,
  )
  for (const p of contractDomicile?.residents ?? []) {
    tryAdd(p.name ?? '', p.nationalId)
  }

  const custodyRaw = getValueViaPath<ApplicantChildCustodyInformationV3[]>(
    application.externalData,
    'childrenCustodyInformation.data',
  )
  for (const child of Array.isArray(custodyRaw) ? custodyRaw : []) {
    tryAdd(child.fullName ?? '', child.nationalId)
  }

  return Array.from(byKennitala.values())
}

/**
 * Full list: contract tenants, then domicile residents, then custody children, deduplicated
 * (used when the repeater has not been stored yet, e.g. overview preview).
 */
const mergeHouseholdMemberSources = (
  application: Application,
): Array<{ name: string; nationalId: string }> => {
  const byKennitala = new Map<string, { name: string; nationalId: string }>()

  const tryAdd = (name: string, nationalId: string | undefined | null) => {
    if (!nationalId) return
    const key = normalizeKennitalaKey(nationalId)
    if (!key || byKennitala.has(key)) return
    byKennitala.set(key, {
      name: name ?? '',
      nationalId: displayNationalId(nationalId),
    })
  }

  for (const t of getRentalAgreementTenantsFlat(application)) {
    tryAdd(t.name, t.nationalId)
  }

  const selectedContractId = getValueViaPath<string | number>(
    application.answers,
    'rentalAgreement.answer',
  )
  if (selectedContractId === undefined || selectedContractId === '') {
    return Array.from(byKennitala.values())
  }
  const selectedNormalized = String(selectedContractId).trim()

  const domicilePayload = getValueViaPath<{
    contracts?: Array<{
      contractId: string
      residents: Array<{ nationalId?: string; name?: string | null }>
    }>
  }>(application.externalData, 'getDomicileResidentsByRentalContracts.data')

  const contractDomicile = domicilePayload?.contracts?.find(
    (c) => String(c.contractId).trim() === selectedNormalized,
  )
  for (const p of contractDomicile?.residents ?? []) {
    tryAdd(p.name ?? '', p.nationalId)
  }

  const custodyRaw = getValueViaPath<ApplicantChildCustodyInformationV3[]>(
    application.externalData,
    'childrenCustodyInformation.data',
  )
  for (const child of Array.isArray(custodyRaw) ? custodyRaw : []) {
    tryAdd(child.fullName ?? '', child.nationalId)
  }

  return Array.from(byKennitala.values())
}

/**
 * Flat name/nationalId rows for overview and for assignee logic when the table repeater has no
 * stored value yet. The nationalIdWithName component uses nested form values; see
 * getHouseholdMembersTableRepeaterDefaultValue for initial row shape.
 */
export const getHouseholdMembersForTable = (
  application: Application,
): Record<string, string>[] => {
  const members = mergeHouseholdMemberSources(application)
  if (members.length === 0) {
    return []
  }

  const fileUploaded = isFileUploaded(application.answers)

  if (fileUploaded) {
    return members.map((p) => ({
      name: p.name,
      nationalId: p.nationalId,
      file: '',
    }))
  }

  return members.map((p) => ({
    name: p.name,
    nationalId: p.nationalId,
  }))
}

/**
 * defaultValue for the household members table repeater: domicile + custody only; contract
 * tenants are shown via getStaticTableData (read-only). Rows here are editable and deletable.
 */
export const getHouseholdMembersTableRepeaterDefaultValue = (
  application: Application,
): Array<{
  nationalIdWithName: { name: string; nationalId: string }
  file?: []
}> => {
  const members = mergeDomicileAndCustodyExcludingContractTenants(application)
  if (members.length === 0) {
    return []
  }

  const fileUploaded = isFileUploaded(application.answers)

  return members.map((m) => {
    if (fileUploaded) {
      return {
        nationalIdWithName: { name: m.name, nationalId: m.nationalId },
        file: [],
      }
    }
    return {
      nationalIdWithName: { name: m.name, nationalId: m.nationalId },
    }
  })
}
