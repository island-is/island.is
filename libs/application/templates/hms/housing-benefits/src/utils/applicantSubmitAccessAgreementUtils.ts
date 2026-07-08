import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { applicantSubmitMessages as asm } from '../lib/messages/applicantSubmitMessages'
import { getApplicantSubmitMissingAccessAgreementChildren } from './assigneeUtils'
import { formatIcelandicNameList } from './utils'

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

/**
 * Display label from `householdMembersTableRepeater` for a child key, else the key string.
 */
const labelForChildNationalIdFromHouseholdTable = (
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

export const applicantSubmitAccessAgreementDescription = (
  application: Application,
) => {
  const children = getApplicantSubmitMissingAccessAgreementChildren(
    application.answers,
    application.externalData,
  )
  const names = formatIcelandicNameList(
    children.map((c) => c.name || c.nationalId),
  )
  if (!names) {
    return asm.applicantSubmitAccessAgreementDescription
  }
  return {
    ...asm.applicantSubmitAccessAgreementDescriptionWithChildren,
    values: { names },
  }
}

export const applicantSubmitAccessAgreementChildOptions = (
  application: Application,
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

  const applicantRaw = getValueViaPath<string>(
    answers,
    'applicant.nationalId',
  )?.trim()
  if (!applicantRaw || !kennitala.isValid(applicantRaw)) {
    return base
  }
  const kt = kennitala.sanitize(applicantRaw)
  const repeater = getValueViaPath<Array<{ childNationalId?: string }>>(
    answers,
    `${kt}.applicantSubmitAccessAgreementRepeater`,
  )

  if (!Array.isArray(repeater)) {
    return base
  }

  const extra: typeof base = []
  for (const row of repeater) {
    const rawId = row?.childNationalId?.trim()
    if (!rawId) continue
    const value = kennitala.isValid(rawId) ? kennitala.sanitize(rawId) : rawId
    if (seen.has(value)) continue
    seen.add(value)
    extra.push({
      value,
      label: labelForChildNationalIdFromHouseholdTable(answers, value) || rawId,
    })
  }

  return [...base, ...extra]
}

export const applicantSubmitAccessAgreementRepeaterMaxRows = (
  answers: FormValue,
  externalData: ExternalData,
): number => {
  const n = getApplicantSubmitMissingAccessAgreementChildren(
    answers,
    externalData,
  ).length
  return n > 0 ? n : 20
}

/** One row per child still missing an umgengnissamningur (blocking until filled). */
export const applicantSubmitAccessAgreementRepeaterMinRows = (
  answers: FormValue,
  externalData: ExternalData,
): number =>
  getApplicantSubmitMissingAccessAgreementChildren(answers, externalData).length
