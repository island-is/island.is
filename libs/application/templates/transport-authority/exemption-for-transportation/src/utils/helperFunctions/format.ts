import format from 'date-fns/format'

export const formatDate = (date: Date): string =>
  date ? format(new Date(date), 'dd.MM.yyyy') : ''

export const formatDateStr = (dateStr: string | undefined): string =>
  dateStr ? formatDate(new Date(dateStr)) : ''

export const formatNumber = (value?: number | string) => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toLocaleString('de-DE') : ''
}

export const formatNumberWithMeters = (value?: number | string) =>
  formatNumber(value) ? `${formatNumber(value)}m` : ''

export const formatNumberWithTons = (value?: number | string) =>
  formatNumber(value) ? `${formatNumber(value)}t` : ''
