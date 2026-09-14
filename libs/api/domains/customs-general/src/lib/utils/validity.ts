/**
 * The upstream API treats `Dags` as a reference date and returns every entry that is in
 * effect on that date - plus the entries that have not taken effect yet, i.e. the ones
 * where `DagsFra` is later than the reference date. Those are published ahead of time on
 * purpose so that consumers can prepare for them, so we keep them in the response and
 * flag them instead, letting the UI label them as upcoming.
 */

/**
 * Validity dates arrive as strings such as `Fri Jan 01 00:00:00 GMT 2027` rather than as
 * ISO strings, even though the generated client types them as `Date`.
 */
export const parseApiDate = (
  value?: Date | string | null,
): Date | undefined => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return isNaN(date.getTime()) ? undefined : date
}

interface Validity {
  validFrom?: Date
  validTo?: Date
  notYetInEffect: boolean
}

/**
 * Resolves the validity of a single entry against the reference date the caller asked for.
 * Entries with an open ended validity use a sentinel end date far in the future, which
 * needs no special handling here - it is only the display that treats it as indefinite.
 */
export const getValidity = (
  referenceDate: string,
  from?: Date | string | null,
  to?: Date | string | null,
): Validity => {
  const validFrom = parseApiDate(from)
  const validTo = parseApiDate(to)
  const reference = parseApiDate(referenceDate)

  return {
    validFrom,
    validTo,
    notYetInEffect: Boolean(reference && validFrom && validFrom > reference),
  }
}

/**
 * Country/currency pairs carry a validity range per side, so the pair is only in effect
 * while both are - the range starts at the later start and ends at the earlier end.
 */
export const getCombinedValidity = (
  referenceDate: string,
  first: { from?: Date | string | null; to?: Date | string | null },
  second: { from?: Date | string | null; to?: Date | string | null },
): Validity => {
  const starts = [parseApiDate(first.from), parseApiDate(second.from)].filter(
    (date): date is Date => date !== undefined,
  )
  const ends = [parseApiDate(first.to), parseApiDate(second.to)].filter(
    (date): date is Date => date !== undefined,
  )

  return getValidity(
    referenceDate,
    starts.length
      ? new Date(Math.max(...starts.map((d) => d.getTime())))
      : null,
    ends.length ? new Date(Math.min(...ends.map((d) => d.getTime()))) : null,
  )
}
