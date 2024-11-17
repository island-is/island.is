// Formats 202301 -> 2023/01
export const periodFormat = (value: number | string) => {
  const period = String(value).trim().replace(/\D/g, '')
  if (period.length !== 6) return value
  return period.replace(/(\d{4})(\d{2})/, '$1/$2')
}
