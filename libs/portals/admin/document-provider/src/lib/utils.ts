// Utility for formatting numbers in Icelandic locale
export const formatNumber = (
  value: number | undefined | null,
  locale = 'is-IS',
): string => {
  if (typeof value === 'number') return value.toLocaleString(locale)
  if (value === undefined || value === null) return ''
  return String(value)
}

// Formatter for Y-axis labels (e.g., 1.2K, 3.4M)
export const formatYAxis = (value: number) => {
  if (value >= 1_000_000)
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (value >= 1_000)
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return value.toString()
}

export const formatDateYYYYMMDD = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}