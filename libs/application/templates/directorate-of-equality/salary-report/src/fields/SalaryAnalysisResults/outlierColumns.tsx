import { createContext, useContext, type ReactNode } from 'react'
import {
  Box,
  Checkbox,
  Tooltip,
  createColumnHelper,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { GENDER_LABELS } from '../../utils/constants'
import { formatPercentMagnitude } from '../../utils/wageGap'

const SELECT_COLUMN_WIDTH = 32
const DASH = '—'
const m = messages.salaryAnalysis.outlierGroup

// Bare amount, no "kr./klst." — the shared formatHourlyWage suffix is ~10
// characters that every row pays for twice, wrapping the cell onto a second
// line and widening the column past what the container holds. OutlierEditor
// carries the unit once, under the table.
// A missing figure is a dash, not a zero: `?? 0` would print "0" as though DMR
// had reported a wage of nothing. The DTO types both wage fields as required, so
// this is contract-defensive rather than a path we expect — but a false figure an
// applicant could act on is the wrong way to fail. Zero itself still formats.
const formatWageAmount = (value?: number | null): string =>
  value == null
    ? DASH
    : value.toLocaleString('is-IS', { maximumFractionDigits: 0 })

/**
 * InteractiveTable wraps every ordinary cell in `<Text variant="medium">`, which
 * is 16px with no prop to change it. `meta.type: 'interactive'` is its one
 * documented opt-out from that wrapper, and skipping the wrapper hands rendering
 * back to `T.Data` — whose own text styles are `variant: 'small'`, i.e. the 14px
 * this table wants. So the flag is doing duty here as "render this cell myself"
 * rather than its named purpose of inputs and buttons; the alternative was a new
 * `size` prop on the shared component.
 *
 * Consequences of leaving the wrapper behind, all handled here or noted:
 *  - body alignment has to come from the cell, since `meta.align` reaches only
 *    the header once the wrapper is gone;
 *  - the header keeps its own hardcoded 16px — an inline style no class can
 *    beat — so headers stay one step larger than the cells;
 *  - on mobile these values sit left in their half of the card instead of right,
 *    and the `#` column, being the card title, loses both the h4 look and the
 *    `as="h2"` that came with it. The expander's aria-labelledby still resolves
 *    to the title element, so what is lost is heading navigation, not labelling.
 */
const COMPACT_CELL = { type: 'interactive' } as const

const compactCell = (children: ReactNode, align?: 'right'): ReactNode => (
  <Box textAlign={align}>{children}</Box>
)

/**
 * Live state the cells need, delivered by context rather than captured in the
 * column defs — see the note on OUTLIER_COLUMNS for why the defs have to be
 * built exactly once.
 */
type OutlierTableContextValue = {
  selected: Set<number>
  allSelectedOnPage: boolean
  toggleSelect: (ordinal: number) => void
  toggleSelectPage: () => void
  // Absent for an employee whose role can't be resolved — neither the POSTPONED
  // nor the DRAFT_RETRY review is granted the draft's employee/role reads, so
  // the column is blank in both rather than wrong.
  roleTitleForOrdinal: (ordinal: number) => string | undefined
}

const OutlierTableContext = createContext<OutlierTableContextValue | undefined>(
  undefined,
)

export const OutlierTableProvider = OutlierTableContext.Provider

const useOutlierTable = (): OutlierTableContextValue => {
  const value = useContext(OutlierTableContext)
  if (!value) {
    throw new Error('Outlier table cells require OutlierTableProvider')
  }
  return value
}

type CellProps = { row: { original: SalaryAnalysisOutlierDto } }

/**
 * `meta.align: 'right'` puts `textAlign: right` on the `<th>`, which does nothing
 * useful: InteractiveTable renders the header inside a flex wrapper, and text
 * alignment does not move a flex item. A sortable column is worse — that wrapper
 * is a button whose CSS hardcodes `textAlign: left`.
 *
 * What survives both is being the last flex item with everything before it
 * pushed away, so a right-aligned header renders as a growing spacer plus the
 * label. `order: 2` is what makes the label last: the sort caret is a sibling
 * flex item appended after us at the default order 0, so without it the label
 * would sit a caret's width short of its own values — the offset that made these
 * headers look left-aligned. Reordering puts the caret on the label's left
 * instead, where it costs the alignment nothing and still reserves its space
 * whether or not the column is currently sorted, so the header does not jump
 * when clicked.
 *
 * The wrappers are spans. The mobile card renders every header label inside
 * `<Text fontWeight="semiBold">`, i.e. a `<p>`, and `Hidden` hides the mobile
 * markup with `display: none` rather than unmounting it — so a `<div>` here is
 * invalid nesting that React logs for every non-title column of every row, at
 * every viewport. A span is still blockified as a flex item in the desktop
 * header wrapper, so the spacer and `order: 2` behave exactly as above.
 */
const headerFor = (
  message: typeof m.roleColumn,
  align?: 'right',
): (() => ReactNode) => {
  const Header = () => {
    const { formatMessage } = useLocale()
    const label = formatMessage(message)
    if (!align) return <Box component="span">{label}</Box>
    return (
      <>
        <Box component="span" flexGrow={1} />
        <Box
          component="span"
          marginLeft={1}
          textAlign="right"
          style={{ order: 2 }}
        >
          {label}
        </Box>
      </>
    )
  }
  return Header
}

const RoleHeader = headerFor(m.roleColumn)
const GenderHeader = headerFor(m.genderColumn)
const StigHeader = headerFor(m.stigColumn, 'right')
const HourlyWageHeader = headerFor(m.hourlyWageColumn, 'right')
const ExpectedHourlyWageHeader = headerFor(m.expectedHourlyWageColumn, 'right')
const DeviationHeader = headerFor(m.deviationColumn, 'right')

// The span is for the same reason as in headerFor. Checkbox's own root is a
// Box, so this header still nests a div inside the mobile `<p>` — pre-existing
// in island-ui and not something a caller can fix from here.
const SelectAllHeader = () => {
  const { formatMessage } = useLocale()
  const { allSelectedOnPage, toggleSelectPage } = useOutlierTable()
  return (
    <Box
      component="span"
      display="flex"
      justifyContent="center"
      style={{ maxWidth: SELECT_COLUMN_WIDTH }}
    >
      <Checkbox
        label=""
        ariaLabel={formatMessage(m.selectAllLabel)}
        checked={allSelectedOnPage}
        onChange={toggleSelectPage}
      />
    </Box>
  )
}

const SelectCell = ({ row }: CellProps) => {
  const { formatMessage } = useLocale()
  const { selected, toggleSelect } = useOutlierTable()
  const ordinal = row.original.employeeOrdinal
  return (
    <Box
      display="flex"
      justifyContent="center"
      style={{ maxWidth: SELECT_COLUMN_WIDTH }}
    >
      <Checkbox
        label=""
        ariaLabel={formatMessage(m.selectEmployeeLabel, {
          employee: String(ordinal),
        })}
        checked={selected.has(ordinal)}
        onChange={() => toggleSelect(ordinal)}
      />
    </Box>
  )
}

// The ordinal alone, not the ABC-000 identifier: it is the number the applicant
// already knows from the employee screens and the workbook, and this tooltip is
// what says so. Sorting is off for this column (see NOT_SORTABLE), which is what
// keeps the tooltip out of a button.
const OrdinalHeader = () => {
  const { formatMessage } = useLocale()
  return (
    <Box component="span" display="flex" alignItems="center" columnGap={1}>
      {formatMessage(m.ordinalColumn)}
      <Tooltip
        placement="right"
        text={formatMessage(m.employeeColumnTooltip)}
      />
    </Box>
  )
}

const OrdinalCell = ({ row }: CellProps) =>
  compactCell(String(row.original.employeeOrdinal))

const RoleCell = ({ row }: CellProps) => {
  const { roleTitleForOrdinal } = useOutlierTable()
  return compactCell(roleTitleForOrdinal(row.original.employeeOrdinal) || DASH)
}

const GenderCell = ({ row }: CellProps) =>
  compactCell(GENDER_LABELS[row.original.gender] ?? row.original.gender)

const StigCell = ({ row }: CellProps) =>
  compactCell(String(row.original.score), 'right')

const HourlyWageCell = ({ row }: CellProps) =>
  compactCell(formatWageAmount(row.original.regularHourlyWage), 'right')

const ExpectedHourlyWageCell = ({ row }: CellProps) =>
  compactCell(formatWageAmount(row.original.expectedHourlyWage), 'right')

// Signed here, unlike the company-level gender gaps: this is a deviation from a
// fitted line, so the sign is meaningful and the word glosses it. The company
// figures are magnitude-only because their sign would imply a denominator
// convention the reader does not have.
//
// payStatus is rendered, not inferred from the sign. A row can be listed for
// being paid ABOVE what their stig imply, which is the opposite of what a reader
// expects, and deviationPercent's sign only conveys that to someone who already
// knows the convention.
const DeviationCell = ({ row }: CellProps) => {
  const { formatMessage } = useLocale()
  const { deviationPercent, payStatus } = row.original
  const sign = deviationPercent > 0 ? '+' : deviationPercent < 0 ? '-' : ''
  const status = formatMessage(
    payStatus === 'UNDERPAID'
      ? m.payStatusUnderpaid
      : payStatus === 'OVERPAID'
      ? m.payStatusOverpaid
      : m.payStatusOnLine,
  )
  return compactCell(
    formatMessage(m.deviationCell, {
      sign,
      value: formatPercentMagnitude(deviationPercent),
      status,
    }),
    'right',
  )
}

/**
 * tanstack enables sorting on every accessor column by default, and a sortable
 * header is rendered inside a `<button>` whose CSS hardcodes `textAlign: left`
 * and reserves 24px for the caret. That silently applied to columns nobody meant
 * to sort: their right-aligned headers came out left-aligned and short of their
 * own values, any header click reordered the table, and the `#` column's tooltip
 * ended up nested inside a button, where clicking it sorts.
 *
 * Stig is the one column worth ordering by, so every other column says so
 * explicitly.
 */
const NOT_SORTABLE = { enableSorting: false } as const

const columnHelper = createColumnHelper<SalaryAnalysisOutlierDto>()

/**
 * Built once, at module load, and deliberately not inside a hook.
 *
 * flexRender uses a function `header`/`cell` as a React *component type*, so a
 * fresh function identity is a fresh element type and React unmounts the whole
 * cell rather than updating it. Every remount re-creates the `React.lazy`
 * wrapper inside island-ui's `Icon`, which re-suspends to its placeholder — the
 * checkbox's checkmark landing a beat after its blue fill, and the tooltip's
 * "i" blinking out and back.
 *
 * The old version rebuilt these defs in a useMemo keyed on `formatMessage`,
 * which `useLocale` re-creates on every single render, so every render remounted
 * every cell in the table. Nothing here may close over render-scoped values:
 * labels come from `useLocale` inside each component, live state from
 * OutlierTableProvider.
 */
export const OUTLIER_COLUMNS = [
  columnHelper.display({
    id: 'select',
    header: SelectAllHeader,
    meta: COMPACT_CELL,
    cell: SelectCell,
  }),
  columnHelper.accessor('employeeOrdinal', {
    id: 'employee',
    header: OrdinalHeader,
    meta: COMPACT_CELL,
    cell: OrdinalCell,
    ...NOT_SORTABLE,
  }),
  columnHelper.display({
    id: 'role',
    header: RoleHeader,
    meta: COMPACT_CELL,
    cell: RoleCell,
  }),
  columnHelper.accessor('gender', {
    id: 'gender',
    header: GenderHeader,
    meta: COMPACT_CELL,
    cell: GenderCell,
    ...NOT_SORTABLE,
  }),
  columnHelper.accessor('score', {
    id: 'score',
    header: StigHeader,
    meta: { ...COMPACT_CELL, align: 'right' },
    enableSorting: true,
    cell: StigCell,
  }),
  columnHelper.accessor('regularHourlyWage', {
    id: 'hourlyWage',
    header: HourlyWageHeader,
    meta: { ...COMPACT_CELL, align: 'right' },
    cell: HourlyWageCell,
    ...NOT_SORTABLE,
  }),
  columnHelper.accessor('expectedHourlyWage', {
    id: 'expectedHourlyWage',
    header: ExpectedHourlyWageHeader,
    meta: { ...COMPACT_CELL, align: 'right' },
    cell: ExpectedHourlyWageCell,
    ...NOT_SORTABLE,
  }),
  columnHelper.accessor('deviationPercent', {
    id: 'deviation',
    header: DeviationHeader,
    meta: { ...COMPACT_CELL, align: 'right' },
    cell: DeviationCell,
    ...NOT_SORTABLE,
  }),
]
