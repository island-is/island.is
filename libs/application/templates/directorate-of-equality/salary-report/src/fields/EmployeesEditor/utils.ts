import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export const formatCurrency = (value?: number | null): string =>
  `${(value ?? 0).toLocaleString('is-IS')} kr.`

export const formatWorkRatio = (ratio?: number | null): string =>
  `${Math.round((ratio ?? 0) * 100)}%`

export const formatStartDate = (value?: string): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}
