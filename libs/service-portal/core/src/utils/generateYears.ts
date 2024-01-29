export function generateYears(
  startDate: Date,
  endDate: Date,
  sort: 'desc' | 'asc' = 'asc',
) {
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()

  const years = []

  if (sort === 'asc') {
    for (let i = startYear; i <= endYear; i++) {
      years.push(i)
    }
  } else {
    for (let i = endYear; i >= startYear; i--) {
      years.push(i)
    }
  }
  return years
}
