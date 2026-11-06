import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { getDateRanges } from '@island.is/application/ui-components/annual-multi-range-calendar/utils'
import {
  HomeLodgingRegistration,
  OvernightStayDateRange,
  OvernightStaySubmission,
} from '../lib/types'

/** Returns the home-lodging registrations supplied by the external data provider. */
export const getHomeLodgings = (
  externalData: ExternalData,
): HomeLodgingRegistration[] =>
  getValueViaPath<HomeLodgingRegistration[]>(
    externalData,
    'homeLodgings.data',
  ) ?? []

/** Finds the registration matching the selected lodging and year. */
export const getSelectedHomeLodging = (
  answers: FormValue,
  externalData: ExternalData,
): HomeLodgingRegistration | undefined => {
  const selectedId = getValueViaPath<string>(answers, 'homeLodgingId')
  const year = Number(getValueViaPath<string>(answers, 'year'))
  const registrations = getHomeLodgings(externalData)

  return (
    registrations.find(
      (registration) =>
        registration.id === selectedId && registration.year === year,
    ) ??
    registrations.find(
      (registration) =>
        registration.id === selectedId || registration.year === year,
    )
  )
}

/** Returns whether the applicant selected that there were no overnight stays. */
export const hasNoOvernightStays = (answers: FormValue): boolean =>
  (getValueViaPath<string[]>(answers, 'noOvernightStays') ?? []).includes(
    'true',
  )

/** Returns whether the applicant has an active advertisement for the lodging. */
export const hasActiveAdvertisement = (answers: FormValue): boolean => {
  const noActiveAdvertisement = getValueViaPath<boolean | string[]>(
    answers,
    'noActiveAdvertisement',
  )

  return !(
    noActiveAdvertisement === true ||
    (Array.isArray(noActiveAdvertisement) &&
      noActiveAdvertisement.includes('true'))
  )
}

/** Returns trimmed, non-empty advertisement URLs from current or legacy answers. */
export const getAdvertisementUrls = (answers: FormValue): string[] => {
  const advertisements = getValueViaPath<Array<{ url?: string }>>(
    answers,
    'advertisements',
  )
  const urls = Array.isArray(advertisements)
    ? advertisements.map((advertisement) => advertisement?.url ?? '')
    : getValueViaPath<string[]>(answers, 'advertisementUrls') ?? []

  return urls.map((url) => url.trim()).filter((url) => url.length > 0)
}

/** Converts a formatted currency answer to a finite numeric amount. */
export const parseAmount = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (!value) {
    return 0
  }

  const normalized = value.replace(/[^\d-]/g, '')
  return Number(normalized) || 0
}

/**
 * Returns the dates that count as overnight stays, excluding the checkout
 * date at the end of each selected range.
 */
export const getOvernightDates = (dates: string[]): string[] => {
  const sortedDates = [...new Set(dates)].sort()

  return getDateRanges(sortedDates).flatMap(({ from, to }) =>
    sortedDates.filter((date) => date >= from && date < to),
  )
}

/** Creates the stable answer key used to associate an amount with a date range. */
export const getDateRangeKey = ({
  from,
  to,
}: OvernightStayDateRange): string => `${from}_${to}`

/**
 * Counts how many overnight stays of a visit fall in each month, keyed by
 * zero-based month index. The checkout date is excluded, so a visit from
 * 30 July to 2 August yields two July nights and one August night.
 */
const getVisitNightsByMonth = ({
  from,
  to,
}: OvernightStayDateRange): Map<number, number> => {
  const nightsByMonth = new Map<number, number>()
  const checkoutDate = new Date(`${to}T00:00:00Z`)
  const date = new Date(`${from}T00:00:00Z`)

  while (date < checkoutDate) {
    const monthIndex = date.getUTCMonth()
    nightsByMonth.set(monthIndex, (nightsByMonth.get(monthIndex) ?? 0) + 1)
    date.setUTCDate(date.getUTCDate() + 1)
  }

  return nightsByMonth
}

/**
 * Distributes a visit amount across the months it spans, proportionally to the
 * number of nights in each month. The rounding remainder is added to the first
 * month so the monthly shares always add back up to the entered amount.
 */
export const splitVisitAmountByMonth = (
  range: OvernightStayDateRange,
  amount: number,
): Map<number, number> => {
  const nightsByMonth = getVisitNightsByMonth(range)
  const monthIndices = [...nightsByMonth.keys()].sort(
    (first, second) => first - second,
  )
  const totalNights = monthIndices.reduce(
    (total, monthIndex) => total + (nightsByMonth.get(monthIndex) ?? 0),
    0,
  )
  const shares = new Map<number, number>()

  if (totalNights === 0) {
    return shares
  }

  const allocated = monthIndices.reduce((total, monthIndex) => {
    const share = Math.floor(
      (amount * (nightsByMonth.get(monthIndex) ?? 0)) / totalNights,
    )
    shares.set(monthIndex, share)

    return total + share
  }, 0)

  const firstMonthIndex = monthIndices[0]
  shares.set(
    firstMonthIndex,
    (shares.get(firstMonthIndex) ?? 0) + (amount - allocated),
  )

  return shares
}

/**
 * Returns the rental income attributed to a month. Per-visit amounts covering
 * more than one month are split proportionally by nights, matching the split
 * applicants are asked to make by hand when entering monthly totals.
 */
export const getMonthlyRentalIncome = ({
  monthIndex,
  pricingMethod,
  monthlyAmounts,
  perVisitAmounts,
  visitRanges,
}: {
  monthIndex: number
  pricingMethod: 'monthly' | 'perVisit'
  monthlyAmounts: Record<string, string | number>
  perVisitAmounts: Record<string, string | number>
  visitRanges: OvernightStayDateRange[]
}): number =>
  pricingMethod === 'monthly'
    ? parseAmount(monthlyAmounts[`month${monthIndex}`])
    : visitRanges.reduce((total, range) => {
        const amount = parseAmount(perVisitAmounts[getDateRangeKey(range)])

        return (
          total + (amount ? splitVisitAmountByMonth(range, amount).get(monthIndex) ?? 0 : 0)
        )
      }, 0)

/**
 * Folds per-visit amounts down into monthly totals so they can prefill the
 * monthly inputs. The fold is deliberately one-way: monthly totals carry no
 * information about the individual visits behind them.
 */
export const getMonthlyAmountsFromVisits = ({
  perVisitAmounts,
  visitRanges,
}: {
  perVisitAmounts: Record<string, string | number>
  visitRanges: OvernightStayDateRange[]
}): Record<string, number> =>
  visitRanges.reduce<Record<string, number>>((monthlyAmounts, range) => {
    const amount = parseAmount(perVisitAmounts[getDateRangeKey(range)])

    if (!amount) {
      return monthlyAmounts
    }

    splitVisitAmountByMonth(range, amount).forEach((share, monthIndex) => {
      const key = `month${monthIndex}`
      monthlyAmounts[key] = (monthlyAmounts[key] ?? 0) + share
    })

    return monthlyAmounts
  }, {})

/** Formats an ISO date range for display using Icelandic day-month-year order. */
export const formatDateRange = ({
  from,
  to,
}: OvernightStayDateRange): string => {
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}.${month}.${year}`
  }

  return `${formatDate(from)} - ${formatDate(to)}`
}

/** Maps application answers to the month-grouped API submission payload. */
export const buildSubmissionPayload = (
  application: Application,
): OvernightStaySubmission => {
  const { answers } = application
  const dates =
    [...(getValueViaPath<string[]>(answers, 'overnightDates') ?? [])].sort()
  const pricingMethod =
    getValueViaPath<'monthly' | 'perVisit'>(answers, 'pricing.method') ??
    'monthly'
  const monthlyAmounts =
    getValueViaPath<Record<string, string | number>>(
      answers,
      'pricing.monthlyAmounts',
    ) ?? {}
  const perVisitAmounts =
    getValueViaPath<Record<string, string | number>>(
      answers,
      'pricing.perVisitAmounts',
    ) ?? {}
  const visitRanges = getDateRanges(dates)
  const overnightDates = getOvernightDates(dates)

  const nights = Array.from({ length: 12 }).flatMap((_, monthIndex) => {
    const monthDates = dates.filter(
      (date) => Number(date.slice(5, 7)) === monthIndex + 1,
    )
    const overnightMonthDates = overnightDates.filter(
      (date) => Number(date.slice(5, 7)) === monthIndex + 1,
    )

    if (overnightMonthDates.length === 0) {
      return []
    }

    const monthlyDateRanges = getDateRanges(monthDates)
    const rentalIncome = getMonthlyRentalIncome({
      monthIndex,
      pricingMethod,
      monthlyAmounts,
      perVisitAmounts,
      visitRanges,
    })

    const dateRanges =
      pricingMethod === 'monthly'
        ? monthlyDateRanges
        : monthlyDateRanges.map((monthlyRange) => {
            const visitRange = visitRanges.find(
              (range) =>
                monthlyRange.from >= range.from &&
                monthlyRange.from <= range.to,
            )

            if (!visitRange) {
              return monthlyRange
            }

            const amount = splitVisitAmountByMonth(
              visitRange,
              parseAmount(perVisitAmounts[getDateRangeKey(visitRange)]),
            ).get(monthIndex)

            return amount ? { ...monthlyRange, amount } : monthlyRange
          })

    return [
      {
        month: monthIndex + 1,
        dateRanges,
        numberOfNights: overnightMonthDates.length,
        rentalIncome,
      },
    ]
  })

  const advertisementUrls = getAdvertisementUrls(answers)

  return {
    homeLodgingId: getValueViaPath<string>(answers, 'homeLodgingId') ?? '',
    year: Number(getValueViaPath<string>(answers, 'year')),
    advertisementUrls,
    hasActiveAdvertisement: hasActiveAdvertisement(answers),
    nights,
    comments: getValueViaPath<string>(answers, 'comments') || undefined,
  }
}
