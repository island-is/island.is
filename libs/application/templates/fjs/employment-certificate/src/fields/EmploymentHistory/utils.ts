import { DataProviderResult, ExternalData } from '@island.is/application/types'
import {
  EmploymentHistoryInstitution,
  EmploymentHistoryPreview,
} from '../../lib/types'
import { PREVIEW_ID } from '../../utils/constants'

export const getPreviewFromExternalData = (
  externalData: ExternalData | undefined,
): EmploymentHistoryPreview | undefined => {
  const result: DataProviderResult | undefined = externalData?.[PREVIEW_ID]
  if (result?.status !== 'success' || !result.data) {
    return undefined
  }
  return result.data as EmploymentHistoryPreview
}

/**
 * The applicant's earlier choice, limited to the institutions still in the
 * preview. All are ticked when there is no earlier choice or none of it is
 * left, since the API needs at least one.
 */
export const getInitialSelection = (
  institutions: EmploymentHistoryInstitution[],
  stored: unknown,
): string[] => {
  const ids = institutions.map((institution) => institution.id)
  const kept = Array.isArray(stored)
    ? ids.filter((id) => stored.includes(id))
    : []
  return kept.length > 0 ? kept : ids
}

/** Keeps the preview's order. */
export const toggleSelection = (
  institutions: EmploymentHistoryInstitution[],
  selected: string[],
  id: string,
): string[] => {
  const next = selected.includes(id)
    ? selected.filter((selectedId) => selectedId !== id)
    : [...selected, id]
  return institutions
    .map((institution) => institution.id)
    .filter((institutionId) => next.includes(institutionId))
}
