import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getApplicantSubmitMissingAccessAgreementChildren } from './assigneeUtils'
import { getNonCustodyMinorsMissingCustodyAgreementNationalIds } from './utils'

/** Compare national IDs consistently for household rows vs repeater values. */
const normalizeKtKey = (nationalId: string | undefined | null) => {
  if (!nationalId || typeof nationalId !== 'string') return ''
  const trimmed = nationalId.trim()
  if (!trimmed) return ''
  return kennitala.isValid(trimmed) ? kennitala.sanitize(trimmed) : trimmed
}

type HouseholdMembersRow = {
  nationalIdWithName?: { nationalId?: string; name?: string }
  isRemoved?: boolean
}

const displayNameFromHouseholdRow = (row: HouseholdMembersRow): string => {
  const nested = row.nationalIdWithName
  const name =
    typeof nested === 'object' && nested ? (nested.name ?? '').trim() : ''
  const id =
    typeof nested === 'object' && nested ? (nested.nationalId ?? '').trim() : ''
  if (name) return name
  if (id) return id
  return ''
}

export const labelForChildNationalIdFromHouseholdTable = (
  answers: FormValue,
  childKey: string,
): string => {
  const rows = getValueViaPath<HouseholdMembersRow[]>(
    answers,
    'householdMembersTableRepeater',
  )
  if (!Array.isArray(rows)) {
    return childKey
  }
  for (const row of rows) {
    if (row.isRemoved) continue
    const nid = row.nationalIdWithName?.nationalId?.trim()
    if (!nid) continue
    if (normalizeKtKey(nid) !== childKey) continue
    const nationalIdForRow = kennitala.isValid(nid)
      ? kennitala.sanitize(nid)
      : nid
    return displayNameFromHouseholdRow(row) || nationalIdForRow
  }
  return childKey
}

/**
 * Select options for optional draft-time access-agreement uploads (same candidate minors as
 * applicant-submit, plus extras already chosen on this repeater).
 */
export const mainFormAccessAgreementChildOptions = (
  application: Application,
  activeValues?: Record<string, unknown>,
) => {
  const { answers, externalData } = application
  const base = getApplicantSubmitMissingAccessAgreementChildren(
    answers,
    externalData,
  ).map((c) => ({
    value: kennitala.sanitize(c.nationalId),
    label: c.name || c.nationalId,
  }))

  const seen = new Set(base.map((o) => String(o.value)))

  const repeater = getValueViaPath<Array<{ childNationalId?: string }>>(
    answers,
    'mainFormAccessAgreementRepeater',
  )

  const extra: typeof base = []
  if (Array.isArray(repeater)) {
    for (const row of repeater) {
      const rawId = row?.childNationalId?.trim()
      if (!rawId) continue
      const value = kennitala.isValid(rawId) ? kennitala.sanitize(rawId) : rawId
      if (seen.has(value)) continue
      seen.add(value)
      extra.push({
        value,
        label:
          labelForChildNationalIdFromHouseholdTable(answers, value) || rawId,
      })
    }
  }

  const merged = [...base, ...extra]

  const raw = activeValues?.childNationalId
  const selected =
    typeof raw === 'string' ? raw.trim() : raw != null ? String(raw).trim() : ''
  if (!selected) {
    return merged
  }
  const selectedKey = kennitala.isValid(selected)
    ? kennitala.sanitize(selected)
    : selected
  const alreadyIn = merged.some((o) => {
    const v = String(o.value)
    const k = kennitala.isValid(v) ? kennitala.sanitize(v) : v
    return k === selectedKey
  })
  if (alreadyIn) {
    return merged
  }
  return [
    ...merged,
    {
      value: selectedKey,
      label:
        labelForChildNationalIdFromHouseholdTable(answers, selectedKey) ||
        selected,
    },
  ]
}

/**
 * One row per household minor under 18 whom the applicant does not have forsjá over and who still
 * needs an umgengnissamningur on the household row (same filter as the household alert).
 */
export const mainFormAccessAgreementRepeaterMinRows = (
  answers: FormValue,
  externalData: ExternalData,
): number =>
  getNonCustodyMinorsMissingCustodyAgreementNationalIds(answers, externalData)
    .length

/**
 * Prefill the main-form access-agreement repeater with those minors (childNationalId only).
 */
export const buildMainFormAccessAgreementRepeaterDefaultRows = (
  answers: FormValue,
  externalData: ExternalData,
): Array<{ childNationalId: string }> =>
  getNonCustodyMinorsMissingCustodyAgreementNationalIds(
    answers,
    externalData,
  ).map((raw) => ({
    childNationalId: kennitala.isValid(raw)
      ? kennitala.sanitize(raw)
      : raw.trim(),
  }))

export const mainFormAccessAgreementRepeaterMaxRows = (
  answers: FormValue,
  externalData: ExternalData,
): number => {
  const nonCustodyMinorCount =
    getNonCustodyMinorsMissingCustodyAgreementNationalIds(
      answers,
      externalData,
    ).length
  const n = getApplicantSubmitMissingAccessAgreementChildren(
    answers,
    externalData,
  ).length
  const base = n > 0 ? n : 20
  return Math.max(nonCustodyMinorCount, base)
}
