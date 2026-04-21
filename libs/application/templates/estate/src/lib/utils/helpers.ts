import { sanitize as sanitizeNationalId } from 'kennitala'

export const nationalIdsMatch = (
  nationalId1?: string | null,
  nationalId2?: string | null,
): boolean => {
  if (!nationalId1 || !nationalId2) return false

  return sanitizeNationalId(nationalId1) === sanitizeNationalId(nationalId2)
}
