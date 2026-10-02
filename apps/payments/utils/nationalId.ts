/** Formats a 10-digit national id as `000000-0000`; anything else is returned as is. */
export const formatNationalId = (nationalId?: string) => {
  if (!nationalId) {
    return ''
  }

  if (nationalId.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  }

  return nationalId
}
