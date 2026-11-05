import { formatCurrency } from '@island.is/shared/utils'

export const formatPercent = (value: number, fractionDigits: number) =>
  value.toLocaleString('is-IS', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

export const formatSignedPercent = (value: number, fractionDigits = 1) =>
  `${value > 0 ? '+' : value < 0 ? '-' : ''}${formatPercent(
    Math.abs(value),
    fractionDigits,
  )}%`

export const formatKronur = (value: number) => formatCurrency(Math.round(value))

export const formatHourlyWage = (value: number) =>
  formatCurrency(Math.round(value), 'kr./klst.')

export const formatThousands = (value: number) =>
  formatCurrency(Math.round(value), '')
