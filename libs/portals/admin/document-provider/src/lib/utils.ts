// Utility for formatting numbers in Icelandic locale
export const formatNumber = (
  value: number | undefined | null,
  locale = 'is-IS',
): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString(locale)
  }
  return ''
}

// Formatter for Y-axis labels (e.g., 1.2K, 3.4M)
export const formatYAxis = (value: number) => {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const nf = new Intl.NumberFormat('is-IS', { maximumFractionDigits: 1 })
  if (abs >= 1_000_000) return `${sign}${nf.format(abs / 1_000_000)}M`
  if (abs >= 1_000) return `${sign}${nf.format(abs / 1_000)}K`
  return nf.format(value)
}

// Convert short month name to full month name for tooltip display
export const getFullMonthName = (
  shortMonthName: string | number | undefined,
): string => {
  if (shortMonthName === undefined || shortMonthName === null) {
    return ''
  }

  if (typeof shortMonthName === 'number') {
    return shortMonthName.toString()
  }

  // Mapping of Icelandic short month names to full month names
  const monthMap: Record<string, string> = {
    'jan.': 'janúar',
    'feb.': 'febrúar',
    'mar.': 'mars',
    'apr.': 'apríl',
    maí: 'maí',
    'jún.': 'júní',
    'júl.': 'júlí',
    'ágú.': 'ágúst',
    'sep.': 'september',
    'okt.': 'október',
    'nóv.': 'nóvember',
    'des.': 'desember',
  }

  return monthMap[shortMonthName] || shortMonthName
}
