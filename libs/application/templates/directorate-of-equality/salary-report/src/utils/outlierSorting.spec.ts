/**
 * The bug this file guards: OutlierEditor hands InteractiveTable ONE PAGE of
 * outliers, so the table's own sorting only ever reordered the ten rows on
 * screen — page 2 sorted independently of page 1, and the "sort by Stig" a
 * reader clicked did not order the list they thought it did. Ordering now
 * happens here, upstream of the slice, with the table put in `manualSorting`.
 *
 * Which makes this module the only thing that can order that table, so the last
 * test below fails if a column is ever enabled for sorting without a comparator
 * to go with it — the failure mode being a header that looks sortable and does
 * nothing at all.
 */
import type { SortingState } from '@island.is/island-ui/core'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { OUTLIER_COLUMNS } from '../fields/SalaryAnalysisResults/outlierColumns'
import { hasOutlierComparator, sortOutliers } from './outlierSorting'

const outlier = (
  employeeOrdinal: number,
  score: number,
): SalaryAnalysisOutlierDto => ({
  employeeOrdinal,
  gender: 'FEMALE',
  roleTitle: 'Sérfræðingur',
  score,
  regularHourlyWage: 4000,
  expectedHourlyWage: 5000,
  deviationPercent: -20,
  payStatus: 'UNDERPAID',
})

const byStig = (desc: boolean): SortingState => [{ id: 'score', desc }]

// More than one page's worth (OUTLIERS_PAGE_SIZE is 10), because sorting only
// part of the list is the whole defect.
const scores = [640, 120, 880, 300, 760, 200, 940, 460, 520, 380, 700, 160]
const outliers = scores.map((score, i) => outlier(i + 1, score))

describe('sortOutliers', () => {
  it('orders the whole list, not just its first page', () => {
    const sorted = sortOutliers(outliers, byStig(false))

    expect(sorted.map((o) => o.score)).toEqual(
      [...scores].sort((a, b) => a - b),
    )
    // The lowest and highest both have to be reachable from the ends of the
    // list. Under the old behaviour the first page held whichever ten arrived
    // first, sorted among themselves.
    expect(sorted[0].score).toBe(120)
    expect(sorted[sorted.length - 1].score).toBe(940)
  })

  it('reverses on desc', () => {
    expect(sortOutliers(outliers, byStig(true)).map((o) => o.score)).toEqual(
      [...scores].sort((a, b) => b - a),
    )
  })

  it('hands back the analysis order untouched when nothing is sorted', () => {
    // Identity, not just equality: this array is handed straight to a prop
    // InteractiveTable keys an effect on, so a fresh copy per render would cost
    // a second render pass on every interaction.
    expect(sortOutliers(outliers, [])).toBe(outliers)
  })

  it('never reorders the array it was handed', () => {
    const source = [...outliers]
    sortOutliers(source, byStig(true))
    expect(source.map((o) => o.score)).toEqual(scores)
  })

  it('keeps the analysis order between rows that tie', () => {
    const tied = [outlier(7, 500), outlier(3, 500), outlier(5, 500)]

    expect(
      sortOutliers(tied, byStig(false)).map((o) => o.employeeOrdinal),
    ).toEqual([7, 3, 5])
  })

  it('leaves the order alone for a column it cannot compare', () => {
    expect(sortOutliers(outliers, [{ id: 'roleTitle', desc: false }])).toBe(
      outliers,
    )
  })

  it('has a comparator for every column the table lets a reader sort', () => {
    // Mirrors TanStack's own getCanSort — `(enableSorting ?? true) &&
    // !!accessorFn` — rather than looking for `enableSorting: true`. Sorting is
    // OPT-OUT there: an accessor column added without `...NOT_SORTABLE` leaves
    // the flag undefined and is sortable, which is the realistic way this
    // regresses. Matching on the explicit flag would miss exactly that case.
    // Display columns carry no accessorKey and are never sortable.
    const sortable = OUTLIER_COLUMNS.filter(
      (column) => 'accessorKey' in column && column.enableSorting !== false,
    ).map((column) => column.id as string)

    // Guards the direction of the dependency too: a column enabled for sorting
    // with nothing here to order it is a dead header, and only this assertion
    // would notice.
    expect(sortable.length).toBeGreaterThan(0)
    expect(sortable.filter((id) => !hasOutlierComparator(id))).toEqual([])
  })
})
