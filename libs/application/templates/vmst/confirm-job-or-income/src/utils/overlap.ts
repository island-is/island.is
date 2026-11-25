type CompanyEntry = {
  company?: { nationalId?: string }
  // Table repeater soft deletes: the row lingers in the answers until submit.
  isRemoved?: boolean
}

export const isActiveRow = (entry?: { isRemoved?: boolean }): boolean =>
  entry?.isRemoved !== true

export type CasualWorkEntry = CompanyEntry & {
  dateFrom?: string
  dateTo?: string
}

export type PartTimeEntry = CompanyEntry & {
  jobStart?: string
  jobEnd?: string
}

type Period = { from: number; to: number }

// `openEnded` treats a missing end date as an infinite period.
const parsePeriod = (
  from?: string,
  to?: string,
  openEnded = false,
): Period | null => {
  if (!from) return null
  const fromTime = Date.parse(from)
  if (Number.isNaN(fromTime)) return null

  if (!to) {
    return openEnded ? { from: fromTime, to: Number.POSITIVE_INFINITY } : null
  }

  const toTime = Date.parse(to)
  if (Number.isNaN(toTime)) return null

  return { from: fromTime, to: toTime }
}

// Inclusive: touching endpoints count as an overlap.
const periodsOverlap = (a: Period, b: Period): boolean =>
  a.from <= b.to && b.from <= a.to

// Indices of part time rows whose period clashes with a casual work period for
// the same company. Errors are reported on the part time rows only, since the
// casual work section always comes first in the form.
export const getPartTimeCasualWorkOverlapIndices = (
  partTimeEntries: PartTimeEntry[],
  casualWorkEntries: CasualWorkEntry[],
): number[] => {
  const indices: number[] = []

  partTimeEntries.forEach((entry, index) => {
    if (!isActiveRow(entry)) return

    const nationalId = entry?.company?.nationalId
    if (!nationalId) return

    const period = parsePeriod(entry.jobStart, entry.jobEnd, true)
    if (!period) return

    const clashes = casualWorkEntries.some((other) => {
      if (!isActiveRow(other)) return false
      if (!other?.company?.nationalId) return false
      if (other.company.nationalId !== nationalId) return false

      const otherPeriod = parsePeriod(other.dateFrom, other.dateTo)
      return otherPeriod ? periodsOverlap(period, otherPeriod) : false
    })

    if (clashes) indices.push(index)
  })

  return indices
}
