export const getCurrentYear = () => {
  const today = new Date()
  let currentYear = today.getFullYear()

  // A new time period starts at the first of september each year
  const newTimePeriodHasStarted = today.getMonth() >= 8

  if (newTimePeriodHasStarted) {
    currentYear += 1
  }
  return currentYear
}

export interface YearOption {
  label: string
  value: string
}

export const getYearOptions = () => {
  const years: YearOption[] = []

  const today = new Date()
  const currentYear = today.getFullYear()

  for (let year = 2001; year <= currentYear; year += 1) {
    const yearString = String(year)
    years.push({
      label: yearString,
      value: yearString,
    })
  }

  return years.reverse()
}

export interface TimePeriodOption {
  label: string
  value: string
  startYear: number
  endYear: number
}

export const generateTimePeriodOptions = () => {
  const timePeriods: TimePeriodOption[] = []

  const currentYear = getCurrentYear()

  for (let year = 2000; year < currentYear; year += 1) {
    const yearString = String(year)
    const lastTwoDigits = yearString.slice(yearString.length - 2)

    let lastTwoDigitsPlusOne = String(Number(lastTwoDigits) + 1)

    if (lastTwoDigitsPlusOne.length === 1) {
      lastTwoDigitsPlusOne = '0' + lastTwoDigitsPlusOne
    }

    timePeriods.push({
      label: `${lastTwoDigits}/${lastTwoDigitsPlusOne}`,
      value: `${lastTwoDigits}${lastTwoDigitsPlusOne}`,
      startYear: year,
      endYear: year + 1,
    })
  }

  return timePeriods.reverse()
}

export const numberFormatter = new Intl.NumberFormat('de-DE')
export const sevenFractionDigitNumberFormatter = new Intl.NumberFormat(
  'de-DE',
  { minimumFractionDigits: 7 },
)

const replaceAll = (str: string, substr: string, replacement: string) => {
  return str.split(substr).join(replacement)
}

export const formattedNumberStringToNumber = (numberString: string) => {
  return Number(replaceAll(replaceAll(numberString, '.', ''), ',', '.'))
}

export const isNumberBelowZero = (value?: number | undefined | null) => {
  return typeof value === 'number' && value < 0
}
