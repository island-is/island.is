function generateMonthArray(months: string[]) {
  const options = months.map((month, i) => {
    const value = ('0' + (i + 1)).slice(-2)
    return { label: month, value }
  })
  return options
}

function generateYearArray(startYear: number) {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = startYear; year <= currentYear; year++) {
    years.push({ label: year.toString(), value: year.toString() })
  }
  return years
}

export { generateMonthArray, generateYearArray }
