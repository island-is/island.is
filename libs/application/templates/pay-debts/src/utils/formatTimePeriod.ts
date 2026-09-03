const PERIOD_PATTERN = /^\d{6}$/

const formatPeriod = (period: string): string =>
  `${period.slice(0, 4)}/${Number(period.slice(4))}`

export const formatTimePeriod = (timePeriod: string | string[]): string => {
  const periods = (
    Array.isArray(timePeriod) ? timePeriod : [timePeriod]
  ).filter(Boolean)

  if (periods.length === 0) {
    return ''
  }

  if (!periods.every((period) => PERIOD_PATTERN.test(period))) {
    return periods.join(', ')
  }

  const sorted = [...periods].sort()
  const earliest = formatPeriod(sorted[0])
  const latest = formatPeriod(sorted[sorted.length - 1])

  return earliest === latest ? earliest : `${earliest}-${latest}`
}
