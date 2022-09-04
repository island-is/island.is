export interface TimePeriodOption {
  label: string
  value: string
}

export const generateTimePeriods = () => {
  const timePeriods: TimePeriodOption[] = []

  const today = new Date()

  let currentYear = today.getFullYear()

  // A new time period starts at 01.09.2022
  const newTimePeriodHasStarted = today.getMonth() >= 8

  if (newTimePeriodHasStarted) {
    currentYear += 1
  }

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
    })
  }

  return timePeriods.reverse()
}
