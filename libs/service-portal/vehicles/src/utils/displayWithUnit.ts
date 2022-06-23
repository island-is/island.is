export const displayWithUnit = (
  value: string | undefined | null,
  unit: 'kg' | 'cc' | 'hö' | 'mm' | 'g/km',
) => {
  if (value) {
    return `${value} ${unit}`
  }
  return ''
}
