import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { isValidDate } from '@island.is/shared/utils'

// FJS sends 0001-01-01 (also as the basic form 00010101) when a debt has no
// due date, so a parseable date is not enough to call it a real one.
export const formatDate = (date: string): string | null => {
  const parsed = parseISO(date ?? '')

  if (!isValidDate(parsed) || parsed.getFullYear() <= 1) {
    return null
  }

  return format(parsed, 'dd.MM.yyyy')
}
