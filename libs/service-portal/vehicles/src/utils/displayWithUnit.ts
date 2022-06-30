export const displayWithUnit = (
  value: string | undefined | null,
  unit: 'kg' | 'cc' | 'hö' | 'mm',
) => {
  if (value) {
    return `${value} ${unit}`
  }
  return ''
}
