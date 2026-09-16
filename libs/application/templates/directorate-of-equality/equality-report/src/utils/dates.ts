const DATE_ONLY_LENGTH = 'yyyy-MM-dd'.length

/**
 * A date-only value from DMR, rendered as d.M.yyyy.
 *
 * Read in UTC on purpose. The value has been through the generated client's
 * response transformer (`new Date(...)`) and then externalData's JSON
 * round-trip, so it arrives as a full ISO instant — and DMR sets the end of the
 * day, e.g. `2028-03-31T23:59:59.000Z`. Reading that in local time lands a day
 * late east of UTC and shows a plan expiring on the 1st of April.
 */
export const formatValidUntil = (value?: string | null): string | null => {
  if (!value) return null
  // A bare `yyyy-MM-dd` already parses as UTC midnight, so both shapes agree.
  const parsed = new Date(
    value.length === DATE_ONLY_LENGTH ? `${value}T00:00:00.000Z` : value,
  )
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.getUTCDate()}.${
    parsed.getUTCMonth() + 1
  }.${parsed.getUTCFullYear()}`
}
