const icelandicMonths = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

/**
 * Returns the next job-search confirmation period as a formatted Icelandic
 * date range string, e.g. "20. - 25. mars".
 *
 * Rules:
 *  - Day 1–4:   window is still open for the current month → show 20-25 of current month
 *  - Day 5–19:  upcoming window → show 20-25 of current month
 *  - Day 20–31: window just opened / ending → show 20-25 of next month
 */
export const getNextConfirmationPeriod = (now: Date = new Date()): string => {
  const day = now.getDate()
  const month = now.getMonth()
  const year = now.getFullYear()

  let targetMonth: number
  let targetYear: number

  if (day >= 20) {
    // Between 20th and end of month → next month's window
    if (month === 11) {
      targetMonth = 0
      targetYear = year + 1
    } else {
      targetMonth = month + 1
      targetYear = year
    }
  } else {
    // Day 1–19 (including the grace period 1–4) → current month's window
    targetMonth = month
    targetYear = year
  }

  return `20. - 25. ${icelandicMonths[targetMonth]}`
}
