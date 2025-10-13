export const getYears = (min: number, max?: number) => {
  const currentYear = new Date().getFullYear()
  const start = currentYear - Math.max(0, min)
  const end = max ? currentYear + max : currentYear
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export const currentMonth = new Date().getMonth() + 1

export const getMonths = () => {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('is-IS', { month: 'long' }),
  )
}
