import { formatCurrency } from '@island.is/shared/utils'

export const formatPercent = (value: number, fractionDigits: number) =>
  value.toLocaleString('is-IS', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

export const formatHourlyWage = (value: number, unit: string) =>
  formatCurrency(Math.round(value), unit)

export const formatThousands = (value: number) =>
  formatCurrency(Math.round(value), '')

export const getPeriodYear = (period?: string | null) =>
  period ? new Date(period).getUTCFullYear() : null

export const formatPeriodMonth = (period: string, lang: string) =>
  new Date(period).toLocaleDateString(lang === 'en' ? 'en-GB' : 'is-IS', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
