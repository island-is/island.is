import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  HomeLodging,
  HomeLodgingYear,
  OvernightStayDateRange,
  OvernightStaySubmission,
} from '../lib/types'

/** Returns the home lodgings supplied by the external data provider. */
export const getHomeLodgings = (externalData: ExternalData): HomeLodging[] =>
  getValueViaPath<HomeLodging[]>(externalData, 'homeLodgings.data') ?? []

/** Returns the lodging's entry for the given year, if it must report for it. */
export const getHomeLodgingYear = (
  lodging: HomeLodging,
  year: number,
): HomeLodgingYear | undefined =>
  lodging.years.find((item) => item.year === year)

/**
 * Returns every year at least one lodging must report for, newest first. A
 * year is fully returned when every lodging listing it has been returned.
 */
export const getReportingYears = (
  lodgings: HomeLodging[],
): Array<{ year: number; allReturned: boolean }> => {
  const years = new Map<number, boolean>()

  for (const lodging of lodgings) {
    for (const { year, returned } of lodging.years) {
      years.set(year, (years.get(year) ?? true) && returned)
    }
  }

  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, allReturned]) => ({ year, allReturned }))
}

/** Returns the lodgings that must report for the given year. */
export const getHomeLodgingsForYear = (
  lodgings: HomeLodging[],
  year: number,
): Array<{ lodging: HomeLodging; returned: boolean }> =>
  lodgings.flatMap((lodging) => {
    const entry = getHomeLodgingYear(lodging, year)
    return entry ? [{ lodging, returned: entry.returned }] : []
  })

/** Finds the selected lodging if it must report for the selected year. */
export const getSelectedHomeLodging = (
  answers: FormValue,
  externalData: ExternalData,
): HomeLodging | undefined => {
  const selectedId = getValueViaPath<string>(answers, 'homeLodgingId')
  const year = Number(getValueViaPath<string>(answers, 'year'))
  const lodging = getHomeLodgings(externalData).find(
    (item) => item.id === selectedId,
  )

  return lodging && getHomeLodgingYear(lodging, year) ? lodging : undefined
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

/**
 * Converts a currency answer to a finite numeric amount.
 *
 * Rental income is registered in whole krónur: both amount inputs use
 * `decimalScale={0}`, so an answer is always an integer numeric string
 * ("175000"). A dot can therefore only be Icelandic thousand grouping, which
 * keeps formatted values such as "175.000 kr." unambiguous.
 */
export const parseAmount = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (!value) {
    return 0
  }

  return Number(value.replace(/[^\d-]/g, '')) || 0
}

const isVisit = (value: unknown): value is OvernightStayDateRange => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const { from, to } = value as Record<string, unknown>
  return typeof from === 'string' && typeof to === 'string' && from < to
}

/**
 * Returns the visits selected in the calendar, oldest first. A visit runs from
 * the check-in day to the checkout day, and the checkout day is not a night.
 * Visits are stored separately, so two guests on consecutive days stay two
 * visits.
 */
export const getVisits = (answers: FormValue): OvernightStayDateRange[] => {
  const visits = getValueViaPath<unknown>(answers, 'visits')

  return (Array.isArray(visits) ? visits : [])
    .filter(isVisit)
    .map(({ from, to }) => ({ from, to }))
    .sort(
      (first, second) =>
        first.from.localeCompare(second.from) ||
        first.to.localeCompare(second.to),
    )
}

/** Creates the stable answer key used to associate an amount with a date range. */
export const getDateRangeKey = ({ from, to }: OvernightStayDateRange): string =>
  `${from}_${to}`

/**
 * Counts how many overnight stays of a visit fall in each month, keyed by
 * zero-based month index. The checkout date is excluded, so a visit from
 * 30 July to 2 August yields two July nights and one August night.
 */
export const getVisitNightsByMonth = ({
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

/** Sums the nights of every visit per zero-based month index. */
export const getNightsByMonth = (
  visits: OvernightStayDateRange[],
): Map<number, number> => {
  const nightsByMonth = new Map<number, number>()

  visits.forEach((visit) =>
    getVisitNightsByMonth(visit).forEach((nights, monthIndex) =>
      nightsByMonth.set(
        monthIndex,
        (nightsByMonth.get(monthIndex) ?? 0) + nights,
      ),
    ),
  )

  return nightsByMonth
}

export const getNumberOfNights = (visits: OvernightStayDateRange[]): number =>
  [...getNightsByMonth(visits).values()].reduce(
    (total, nights) => total + nights,
    0,
  )

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Returns the part of a visit that falls in a month. `to` keeps its meaning as
 * the checkout day: a visit continuing into the next month ends on the first
 * day of that month, so every range's nights are `to - from`.
 */
export const getVisitPartInMonth = (
  visit: OvernightStayDateRange,
  monthIndex: number,
): OvernightStayDateRange | undefined => {
  const year = Number(visit.from.slice(0, 4))
  const monthStart = `${year}-${pad(monthIndex + 1)}-01`
  const nextMonthStart =
    monthIndex === 11
      ? `${year + 1}-01-01`
      : `${year}-${pad(monthIndex + 2)}-01`
  const from = visit.from > monthStart ? visit.from : monthStart
  const to = visit.to < nextMonthStart ? visit.to : nextMonthStart

  return from < to ? { from, to } : undefined
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
          total +
          (amount
            ? splitVisitAmountByMonth(range, amount).get(monthIndex) ?? 0
            : 0)
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

/** Returns the selected visit keys whose rental income is negative. */
export const getNegativePerVisitAmountKeys = ({
  perVisitAmounts,
  visitRanges,
}: {
  perVisitAmounts: Record<string, string | number>
  visitRanges: OvernightStayDateRange[]
}): string[] =>
  visitRanges.flatMap((range) => {
    const key = getDateRangeKey(range)

    return parseAmount(perVisitAmounts[key]) < 0 ? [key] : []
  })

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
  // A year declared as having no overnight stays must never report nights or
  // rental income, even when dates and prices from an earlier edit are still
  // stored: the calendar and pricing screens are only hidden by `condition`,
  // which leaves their answers behind.
  const visits = hasNoOvernightStays(answers) ? [] : getVisits(answers)
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
  const nightsByMonth = getNightsByMonth(visits)

  const nights = Array.from({ length: 12 }).flatMap((_, monthIndex) => {
    const numberOfNights = nightsByMonth.get(monthIndex) ?? 0

    if (numberOfNights === 0) {
      return []
    }

    const dateRanges = visits.flatMap((visit) => {
      const part = getVisitPartInMonth(visit, monthIndex)

      if (!part) {
        return []
      }

      if (pricingMethod === 'monthly') {
        return [part]
      }

      const amount = splitVisitAmountByMonth(
        visit,
        parseAmount(perVisitAmounts[getDateRangeKey(visit)]),
      ).get(monthIndex)

      return [amount === undefined ? part : { ...part, amount }]
    })

    return [
      {
        month: monthIndex + 1,
        dateRanges,
        numberOfNights,
        rentalIncome: getMonthlyRentalIncome({
          monthIndex,
          pricingMethod,
          monthlyAmounts,
          perVisitAmounts,
          visitRanges: visits,
        }),
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
