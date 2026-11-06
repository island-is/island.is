import type { SortingState } from '@island.is/island-ui/core'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'

/**
 * The column ids OUTLIER_COLUMNS marks sortable — Stig alone today.
 *
 * Every id in here needs an entry in SORT_VALUE below, and outlierSorting.spec
 * fails if a column is enabled for sorting without one. That check is the point
 * of this module being separate: OutlierEditor hands InteractiveTable
 * `manualSorting`, so the ORDER is this file's job, and a column that TanStack
 * lets the reader click but nothing here can order would look sortable and do
 * nothing at all.
 */
export type SortableOutlierColumnId = 'score'

const SORT_VALUE: Record<
  SortableOutlierColumnId,
  (outlier: SalaryAnalysisOutlierDto) => number
> = {
  score: (outlier) => outlier.score,
}

export const hasOutlierComparator = (columnId: string): boolean =>
  columnId in SORT_VALUE

/**
 * Orders the WHOLE unassigned list, which is the reason this exists.
 *
 * InteractiveTable sorts the `data` it is handed, and OutlierEditor hands it one
 * page — so its built-in sorting reordered the ten rows on screen and left the
 * rest of the list where it was, sorting page 2 separately from page 1. The list
 * has to be ordered BEFORE it is sliced, which means the ordering has to happen
 * out here and the table has to be told to keep its hands off it
 * (`manualSorting`).
 *
 * An empty `sorting` is the order the analysis arrived in, and is returned
 * untouched — not copied — so the common case adds no array churn to a prop
 * InteractiveTable keys an effect on.
 */
export const sortOutliers = (
  outliers: SalaryAnalysisOutlierDto[],
  sorting: SortingState,
): SalaryAnalysisOutlierDto[] => {
  // Single-column sorting: TanStack models `sorting` as a stack, but nothing
  // here enables multi-sort, so anything past the first entry is not reachable.
  const [order] = sorting
  if (!order) return outliers

  const value = SORT_VALUE[order.id as SortableOutlierColumnId]
  if (!value) return outliers

  const direction = order.desc ? -1 : 1

  // A copy: `outliers` is derived from the analysis result held in state, and
  // sort() reorders in place.
  //
  // Array#sort is stable (ES2019 on), so outliers that tie on the sorted column
  // keep the order the analysis listed them in rather than being shuffled.
  return [...outliers].sort((a, b) => (value(a) - value(b)) * direction)
}
