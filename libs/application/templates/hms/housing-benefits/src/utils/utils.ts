import { getValueViaPath, YES } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformationV3,
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getLandlordOptionsForSelectedContract } from './rentalAgreementUtils'

export const isHouseholdMemberUnder18 = (
  _application: Application,
  activeField?: Record<string, unknown>,
): boolean => {
  const nationalId =
    (activeField?.nationalIdWithName as { nationalId?: string })?.nationalId ??
    (activeField?.nationalId as string)
  if (!nationalId || typeof nationalId !== 'string') return false
  try {
    return kennitala.isValid(nationalId) && kennitala.info(nationalId).age < 18
  } catch {
    return false
  }
}

export const isFileUploaded = (answers: FormValue): boolean => {
  const rows = getValueViaPath<
    Array<{ file?: Array<{ key: string; name: string }> }>
  >(answers, 'householdMembersTableRepeater')
  return (
    Array.isArray(rows) &&
    rows.some((row) => Array.isArray(row.file) && row.file.length > 0)
  )
}

const normalizeKennitalaKey = (nationalId: string | undefined | null) => {
  if (!nationalId || typeof nationalId !== 'string') return ''
  const trimmed = nationalId.trim()
  if (!trimmed) return ''
  return kennitala.isValid(trimmed) ? kennitala.sanitize(trimmed) : trimmed
}

type HouseholdMemberTableRow = {
  nationalIdWithName?: { nationalId?: string; name?: string }
  file?: Array<{ key: string; name: string }>
  isRemoved?: boolean
}

const displayNameForHouseholdRow = (row: HouseholdMemberTableRow): string => {
  const nested = row.nationalIdWithName
  const name =
    typeof nested === 'object' && nested != null
      ? (nested.name ?? '').trim()
      : ''
  const id =
    typeof nested === 'object' && nested != null
      ? (nested.nationalId ?? '').trim()
      : ''
  if (name) return name
  if (id) return id
  return ''
}

/** Formats a list of names for Icelandic copy (e.g. "A, B og C"). */
export const formatIcelandicNameList = (names: string[]): string => {
  const list = names.map((n) => n.trim()).filter(Boolean)
  if (list.length === 0) return ''
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} og ${list[1]}`
  return `${list.slice(0, -1).join(', ')} og ${list[list.length - 1]}`
}

const buildCustodyNationalIdSet = (externalData: ExternalData) => {
  const custodyRaw = getValueViaPath<ApplicantChildCustodyInformationV3[]>(
    externalData,
    'childrenCustodyInformation.data',
  )
  const inCustody = new Set<string>()
  for (const child of Array.isArray(custodyRaw) ? custodyRaw : []) {
    const key = normalizeKennitalaKey(child.nationalId)
    if (key) inCustody.add(key)
  }
  return inCustody
}

/** Applicant (registry) forsjá — same keys as used for household minor custody checks. */
export const getApplicantChildCustodyNationalIdSet = (
  externalData: ExternalData,
) => buildCustodyNationalIdSet(externalData)

/**
 * Display names of household members in the table repeater who are under 18, not in the
 * applicant's children-in-custody list, and have no umgengnissamningur file on that row.
 */
export const getNonCustodyMinorsMissingCustodyAgreementNames = (
  answers: FormValue,
  externalData: ExternalData,
): string[] => {
  const inCustody = buildCustodyNationalIdSet(externalData)

  const rows = getValueViaPath<HouseholdMemberTableRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) {
    return []
  }

  const result: string[] = []
  for (const row of rows) {
    if (row.isRemoved) continue
    const nationalId = row.nationalIdWithName?.nationalId
    if (!nationalId || !kennitala.isValid(nationalId)) continue
    let age: number
    try {
      age = kennitala.info(nationalId).age
    } catch {
      continue
    }
    if (age >= 18) continue
    if (inCustody.has(normalizeKennitalaKey(nationalId))) continue
    const hasFile = Array.isArray(row.file) && row.file.length > 0
    if (hasFile) continue
    const label = displayNameForHouseholdRow(row)
    if (label) result.push(label)
  }
  return result
}

/**
 * Whether the minor has any umgengnissamningur file attached: household repeater row, optional
 * main-form `mainFormAccessAgreementRepeater`, any assignee’s `assigneeAccessAgreementRepeater` /
 * legacy fields, or applicant submit screen.
 */
export const minorHasAnyUmgengnissamningurUploadAttached = (
  answers: FormValue,
  childNationalId: string,
): boolean => {
  const targetKey = normalizeKennitalaKey(childNationalId)
  if (!targetKey) return false

  const rows = getValueViaPath<HouseholdMemberTableRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (row.isRemoved) continue
      const id = row.nationalIdWithName?.nationalId
      if (!id || normalizeKennitalaKey(id) !== targetKey) continue
      if (Array.isArray(row.file) && row.file.length > 0) return true
    }
  }

  const ans = answers as Record<string, unknown>
  for (const kt of Object.keys(ans)) {
    if (!kennitala.isValid(kt)) continue
    const bucket = ans[kt] as Record<string, unknown> | undefined
    if (!bucket) continue

    const repeater = bucket.assigneeAccessAgreementRepeater as
      | Array<{
          childNationalId?: string
          file?: Array<{ key: string; name: string }>
        }>
      | undefined
    if (Array.isArray(repeater)) {
      for (const r of repeater) {
        const cid = r.childNationalId?.trim()
        if (!cid) continue
        if (normalizeKennitalaKey(cid) !== targetKey) continue
        if (Array.isArray(r.file) && r.file.length > 0) return true
      }
    }

    const legacyFiles = bucket.assigneeUmgengnissamningurFile as
      | Array<{ key: string; name: string }>
      | undefined
    const forChild = (
      bucket.assigneeUmgengnissamningurForChildNationalId as string | undefined
    )?.trim()
    if (
      Array.isArray(legacyFiles) &&
      legacyFiles.length > 0 &&
      forChild &&
      normalizeKennitalaKey(forChild) === targetKey
    ) {
      return true
    }

    const submitRepeater = bucket.applicantSubmitAccessAgreementRepeater as
      | Array<{
          childNationalId?: string
          file?: Array<{ key: string; name: string }>
        }>
      | undefined
    if (Array.isArray(submitRepeater)) {
      for (const r of submitRepeater) {
        const cid = r.childNationalId?.trim()
        if (!cid) continue
        if (normalizeKennitalaKey(cid) !== targetKey) continue
        if (Array.isArray(r.file) && r.file.length > 0) return true
      }
    }
  }

  const mainFormRepeater = (answers as Record<string, unknown>)
    .mainFormAccessAgreementRepeater as
    | Array<{
        childNationalId?: string
        file?: Array<{ key: string; name: string }>
      }>
    | undefined
  if (Array.isArray(mainFormRepeater)) {
    for (const r of mainFormRepeater) {
      const cid = r.childNationalId?.trim()
      if (!cid) continue
      if (normalizeKennitalaKey(cid) !== targetKey) continue
      if (Array.isArray(r.file) && r.file.length > 0) return true
    }
  }

  return false
}

/** National IDs for `getNonCustodyMinorsMissingCustodyAgreementNames` (same filtering). */
export const getNonCustodyMinorsMissingCustodyAgreementNationalIds = (
  answers: FormValue,
  externalData: ExternalData,
): string[] => {
  const inCustody = buildCustodyNationalIdSet(externalData)
  const rows = getValueViaPath<HouseholdMemberTableRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) {
    return []
  }
  const result: string[] = []
  for (const row of rows) {
    if (row.isRemoved) continue
    const nationalId = row.nationalIdWithName?.nationalId
    if (!nationalId || !kennitala.isValid(nationalId)) continue
    try {
      if (kennitala.info(nationalId).age >= 18) continue
    } catch {
      continue
    }
    if (inCustody.has(normalizeKennitalaKey(nationalId))) continue
    const hasFile = Array.isArray(row.file) && row.file.length > 0
    if (hasFile) continue
    result.push(nationalId.trim())
  }
  return result
}

/**
 * True when at least one row in the household table is a person under 18 who is not in the
 * applicant's children-in-custody list (from national registry) and that row has no
 * umgengnissamningur file yet.
 */
export const shouldShowNonCustodyMinorMissingCustodyAgreementAlert = (
  answers: FormValue,
  externalData: ExternalData,
): boolean =>
  getNonCustodyMinorsMissingCustodyAgreementNames(answers, externalData)
    .length > 0

/**
 * True when the household table includes at least one person under 18 who is not in the
 * applicant's children-in-custody list (national registry), regardless of uploaded files.
 */
export const hasNonCustodyMinorsInHousehold = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const inCustody = buildCustodyNationalIdSet(externalData)

  const rows = getValueViaPath<HouseholdMemberTableRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) {
    return false
  }

  for (const row of rows) {
    if (row.isRemoved) continue
    const nationalId = row.nationalIdWithName?.nationalId
    if (!nationalId || !kennitala.isValid(nationalId)) continue
    try {
      if (kennitala.info(nationalId).age >= 18) continue
    } catch {
      continue
    }
    if (inCustody.has(normalizeKennitalaKey(nationalId))) continue
    return true
  }
  return false
}

export const isLandlordSelected = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'payment.paymentRadio') === 'landlord'

export const shouldShowLandlordSelection = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  isLandlordSelected(answers) &&
  getLandlordOptionsForSelectedContract({
    answers,
    externalData,
  } as Application).length > 1

export const isExemptionRequested = (answers: FormValue) => {
  const exemptionCheckbox = getValueViaPath<string[]>(
    answers,
    'exemptionCheckbox',
  )
  return Array.isArray(exemptionCheckbox) && exemptionCheckbox.includes(YES)
}

export const isExemptionReason = (answers: FormValue, reason: string) =>
  isExemptionRequested(answers) &&
  getValueViaPath<string>(answers, 'exemptionReason') === reason

type PersonalTaxReturnData = {
  handedInLastYear?: boolean
  handedInLastFiveYears?: boolean
}

const getPersonalTaxReturnData = (
  externalData?: ExternalData,
): PersonalTaxReturnData | undefined => {
  const result = externalData?.getPersonalTaxReturn
  if (!result || result.status !== 'success') return undefined
  return result.data as PersonalTaxReturnData | undefined
}

/**
 * Tax return was not filed for last year, so the applicant must declare assets manually.
 * Only true for the "never filed" case (also covers people who just moved to the country).
 */
export const isTaxReturnNotFiled = (
  _answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  const data = getPersonalTaxReturnData(externalData)
  if (!data) return false
  return data.handedInLastFiveYears === false
}

/** Tax return was filed last year, so income can be pulled from it automatically. */
export const isTaxReturnFiled = (
  _answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  const data = getPersonalTaxReturnData(externalData)
  if (!data) return false
  return data.handedInLastYear === true
}

/**
 * Applicant filed a tax return within the last five years but not last year. They must
 * file last year's return before applying, so we route them to a terminal info state.
 */
export const mustFileTaxReturnBeforeApplying = (
  application: Application,
): boolean => {
  const data = getPersonalTaxReturnData(application.externalData)
  if (!data) return false
  return data.handedInLastFiveYears === true && data.handedInLastYear === false
}
