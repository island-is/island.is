import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import {
  applicationFromFormValue,
  getAssigneeChildrenStillMissingAnyAccessAgreementUpload,
  getAssigneeNationalIdForUmgengnissamningurForm,
} from './assigneeUtils'
import { labelForChildNationalIdFromHouseholdTable } from './mainFormAccessAgreementUtils'

/**
 * Repeater rows for the assignee access-agreement step (per-assignee bucket).
 */
export const findAssigneeAccessAgreementRepeater = (
  answers: FormValue,
  externalData: ExternalData = {} as ExternalData,
): Array<{ childNationalId?: string; file?: unknown }> | undefined => {
  const app = { answers, externalData } as Application
  const preferredId = getAssigneeNationalIdForUmgengnissamningurForm(app)
  if (preferredId?.trim()) {
    const kt = kennitala.isValid(preferredId)
      ? kennitala.sanitize(preferredId)
      : preferredId.trim()
    const bucket = (answers as Record<string, unknown>)[kt] as
      | { assigneeAccessAgreementRepeater?: unknown }
      | undefined
    const preferred = bucket?.assigneeAccessAgreementRepeater
    if (Array.isArray(preferred)) {
      return preferred as Array<{ childNationalId?: string; file?: unknown }>
    }
  }
  for (const key of Object.keys(answers ?? {})) {
    if (!kennitala.isValid(key)) {
      continue
    }
    const bucket = (answers as Record<string, unknown>)[key] as
      | { assigneeAccessAgreementRepeater?: unknown }
      | undefined
    const arr = bucket?.assigneeAccessAgreementRepeater
    if (Array.isArray(arr)) {
      return arr as Array<{ childNationalId?: string; file?: unknown }>
    }
  }
  return undefined
}

/**
 * Select options for the assignee access-agreement repeater: minors this assignee may still
 * document, plus any extra row selections already stored on the repeater.
 */
export const assigneeAccessAgreementChildOptions = (
  application: Application,
  activeValues?: Record<string, unknown>,
) => {
  const assigneeId = getAssigneeNationalIdForUmgengnissamningurForm(application)
  if (!assigneeId) {
    return []
  }
  const { answers, externalData } = application
  const base = getAssigneeChildrenStillMissingAnyAccessAgreementUpload(
    answers,
    externalData,
    assigneeId,
  ).map((c) => ({
    value: kennitala.sanitize(c.nationalId),
    label: c.name || c.nationalId,
  }))

  const seen = new Set(base.map((o) => String(o.value)))

  const repeater = findAssigneeAccessAgreementRepeater(answers, externalData)

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

export const assigneeAccessAgreementRepeaterMinRows = (
  answers: FormValue,
  externalData: ExternalData,
): number => {
  const app = applicationFromFormValue(answers, externalData)
  const assigneeId = getAssigneeNationalIdForUmgengnissamningurForm(app)
  if (!assigneeId) {
    return 0
  }
  return getAssigneeChildrenStillMissingAnyAccessAgreementUpload(
    answers,
    externalData,
    assigneeId,
  ).length
}

export const assigneeAccessAgreementRepeaterMaxRows = (
  answers: FormValue,
  externalData: ExternalData,
): number => {
  const app = applicationFromFormValue(answers, externalData)
  const assigneeId = getAssigneeNationalIdForUmgengnissamningurForm(app)
  if (!assigneeId) {
    return 20
  }
  return getAssigneeChildrenStillMissingAnyAccessAgreementUpload(
    answers,
    externalData,
    assigneeId,
  ).length
}

/**
 * Prefill one row per child still missing an umgengnissamningur (anywhere in the application).
 */
export const buildAssigneeAccessAgreementRepeaterDefaultRows = (
  application: Application,
): Array<{ childNationalId: string }> => {
  const assigneeId = getAssigneeNationalIdForUmgengnissamningurForm(application)
  if (!assigneeId) {
    return []
  }
  return getAssigneeChildrenStillMissingAnyAccessAgreementUpload(
    application.answers,
    application.externalData,
    assigneeId,
  ).map((c) => ({
    childNationalId: kennitala.isValid(c.nationalId)
      ? kennitala.sanitize(c.nationalId)
      : c.nationalId.trim(),
  }))
}
