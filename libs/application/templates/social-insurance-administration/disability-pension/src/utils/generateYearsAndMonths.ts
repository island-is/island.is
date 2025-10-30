export const generatePast24Months = (): Record<number, Array<number>> => {
  const result: Record<number, Array<number>> = {}
  const currentDate = new Date()

  for (let i = 24; i > 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1,
    )
    const year = date.getFullYear()
    const month = date.getMonth()
    if (year in result) {
      result[year].push(month)
    } else {
      result[year] = [month]
    }
  }

  return result
}
