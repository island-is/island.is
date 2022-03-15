import { DAY } from './constants'
import addYears from 'date-fns/addYears'
import compareDesc from 'date-fns/compareDesc'
import { Residence } from './types'

/**
 * Compute a summary of how many days you've spent as a resident of each country in
 * the last 365 days
 *
 * @param history list from national id registry of residences
 * @returns map of country code to days spent in country in the last 365 days
 */
export const computeCountryResidence = (history: Residence[]) => {
  if (history.length < 1) {
    return null
  }

  const sorted = history.sort(({ dateOfChange: a }, { dateOfChange: b }) =>
    compareDesc(new Date(a), new Date(b)),
  )

  const yearAgo = addYears(new Date(), -1).getTime()

  let lastTime = Date.now()

  const timeByCountry: Record<string, number> = {}

  // I realize this seems complicated, but there's a few edge cases as well.
  // We have to account for history with a single entry within the last year,
  // account for complicated residence histories overlapping the current year, etc
  // Note: current > yearAgo check is not necessary.. it
  for (const { dateOfChange, country } of sorted) {
    const current = Math.max(dateOfChange.getTime(), yearAgo)
    const period = Math.round((lastTime - current) / DAY)
    timeByCountry[country] = (timeByCountry[country] || 0) + period
    lastTime = current
  }

  return timeByCountry
}
