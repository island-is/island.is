const NATIONAL_ID_REGEX = /^\d{10}$/
const SUBJECT_ID_REGEX = /^[A-Za-z0-9._-]+$/

export const isValidSearch = (search: string): boolean => {
  const trimmed = search.trim()
  if (!trimmed) return false
  return NATIONAL_ID_REGEX.test(trimmed) || SUBJECT_ID_REGEX.test(trimmed)
}
