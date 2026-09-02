import format from 'date-fns/format'
import { isValidDate } from '@island.is/shared/utils'

export const formatDate = (date: string): string => {
  if (!date) {
    return ''
  }

  const parsed = new Date(date)

  return isValidDate(parsed) ? format(parsed, 'dd.MM.yyyy') : date
}
