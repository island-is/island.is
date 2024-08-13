import getYear from 'date-fns/getYear'

export const getYearInterval = (dates: string[]) => {
  const sortedDates = dates
    .map((date) => new Date(date))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime())
  const startYear = sortedDates[0].getFullYear()
  const endYear = sortedDates.slice(-1)[0].getFullYear()
  return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
}

export const generateExamDateSpan = (
  firstDate?: Date,
  lastDate?: Date,
): string | null => {
  if (firstDate && lastDate) {
    return `${getYear(firstDate)} - ${getYear(lastDate)}`
  }

  if (firstDate) {
    return `${getYear(firstDate)}`
  }

  if (lastDate) {
    return `${getYear(lastDate)}`
  }

  return null
}
