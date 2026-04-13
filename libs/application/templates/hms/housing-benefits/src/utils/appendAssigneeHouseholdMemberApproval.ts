import { Application, FormValue } from '@island.is/application/types'
import * as kennitala from 'kennitala'

/**
 * Appends a sanitized national id to householdMemberApprovals when not already present.
 */
export const appendAssigneeToHouseholdMemberApprovals = (
  application: Application,
  nationalId: string,
): FormValue => {
  const normalized = kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId
  const existing = (application.answers?.householdMemberApprovals ??
    []) as string[]
  const normalizedExisting = new Set(
    existing.map((id) => (kennitala.isValid(id) ? kennitala.sanitize(id) : id)),
  )
  if (normalizedExisting.has(normalized)) {
    return {}
  }
  return {
    householdMemberApprovals: [...existing, normalized],
  }
}
