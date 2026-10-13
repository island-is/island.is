import { useState, type ReactNode } from 'react'
import {
  Box,
  FocusableBox,
  Icon,
  Table as T,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatWageAmount } from '../EmployeesEditor/utils'
import {
  formatDeviationLabel,
  formatSalaryAnalysisGenderLabel,
  formatStig,
} from '../../utils/salaryAnalysisLabels'
import { formatSignedPercentMagnitude } from '../../utils/wageGap'
import { EmployeeOrdinalHeader } from '../../components/EmployeeOrdinalHeader'
import { TablePagination } from '../TablePagination'
import * as styles from './PayDispersionTable.css'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']
type PayDispersionEmployee = PayDispersionDto['employees'][number]
type PayDispersionBlocker = PayDispersionDto['blockers'][number]

const RENDERED_POPULATION: PayDispersionDto['population'] = 'ALL_EMPLOYEES'
const dash = '—'

/**
 * Rows per page.
 *
 * Set AT the API's soft cap on purpose, not below it: the contract says this
 * list almost never passes 20 and can never pass 100, so a page size of 20
 * leaves the ordinary report rendering exactly as it always has — one page, and
 * TablePagination draws nothing at all below a single page — while the unusual
 * long list is the only one that gets broken up. Five pages at the hard cap,
 * which is a pager a reader can still take in at a glance.
 *
 * Local rather than the shared TABLE_PAGE_SIZE (50): that constant sizes the
 * employee tables, which are the applicant's own data and can run to thousands
 * of rows. This is an advisory of at most 100.
 */
const PAY_DISPERSION_PAGE_SIZE = 20

type SortKey =
  | 'ordinal'
  | 'gender'
  | 'score'
  | 'wage'
  | 'expected'
  | 'deviation'
  | 'spread'

/**
 * `null` is not "unsorted" — it is the order the SERVER sent, which is a
 * ranking: the most extreme few in each direction, as `listRule` states above
 * the table. That is why sorting is a three-state cycle rather than the usual
 * asc/desc toggle; without the third state a reader who sorts by Stig has no
 * way back to the list the copy describes.
 */
type SortState = { key: SortKey; direction: 'asc' | 'desc' } | null

/**
 * Padding identical to the `cellBox` OutlierEditor hands InteractiveTable, so the
 * two tables have the same row rhythm. (The header type does deliberately differ —
 * see HEADER_TEXT.)
 *
 * Longhand on purpose: T.Data/T.HeadData spread this object over their own
 * paddingTop/paddingBottom ('p5' = 18px) and paddingLeft/paddingRight (3 = 24px)
 * in a single useBoxStyles call, and that call resolves each side as
 * `paddingTop ?? paddingY ?? padding`. A shorthand here would therefore lose to
 * the longhands already in the object, while these longhands replace them
 * outright. The 18px vertical default is most of why this table stood a head
 * taller than the úrbótaáætlun one for the same number of rows.
 */
const CELL_BOX = {
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 'p2',
  paddingRight: 'p2',
} as const

/**
 * Headers at the body cells' own size, distinguished by weight alone.
 *
 * T.HeadData's `variant: 'h5'` is 18px on desktop, and the úrbótaáætlun table
 * only pulls that back to 16px (InteractiveTable puts an inline `fontSize:
 * '16px'` on its `<th>`) — still a size step AND a weight step above its 14px
 * body cells. This table deliberately goes one step further down than that
 * reference: it is an advisory that requires no action, so it should not carry
 * more visual weight than the úrbótaáætlun table the applicant must actually
 * fill in.
 *
 * Swapping the variant rather than overriding `fontSize` inline, because
 * T.HeadData spreads `text` over its own `variant: 'h5'` inside a single
 * getTextStyles call — so `small` here means the header tracks the body cells at
 * BOTH breakpoints (12px mobile, 14px desktop) instead of being pinned flat by a
 * hardcoded pixel value. fontWeight has to be restated: it is `variant: 'h5'`
 * that was supplying the 600, and changing the variant would otherwise drop the
 * headers to `small`'s regular 400 and leave them indistinguishable from data.
 *
 * The sort buttons inherit this through `font: inherit` rather than restating
 * it — see PayDispersionTable.css.
 */
const HEADER_TEXT = { variant: 'small', fontWeight: 'semiBold' } as const

// `align` is forwarded as 'left' rather than left undefined: T.HeadData's own
// default is 'left', and passing undefined through would override that with
// nothing at all — leaving the `<th>` on the browser's centred default.
const HeadCell = ({
  children,
  align = 'left',
  ariaSort,
}: {
  children: ReactNode
  align?: 'left' | 'right'
  // Carried by the cell, not by the button inside it: aria-sort is only defined
  // on a column header, and it is what tells a screen reader which way the
  // column is currently ordered. Undefined — the attribute absent entirely —
  // when the table is too short to be worth sorting, so a one-row table does not
  // announce seven unsorted columns.
  ariaSort?: 'ascending' | 'descending' | 'none'
}) => (
  <T.HeadData
    box={CELL_BOX}
    text={HEADER_TEXT}
    align={align}
    scope="col"
    aria-sort={ariaSort}
  >
    {children}
  </T.HeadData>
)

const DataCell = ({
  children,
  align,
}: {
  children: ReactNode
  align?: 'right'
}) => (
  <T.Data box={CELL_BOX} align={align}>
    {children}
  </T.Data>
)

// Two decimals, unlike every percentage in the report: this is the figure the
// threshold is stated in ("2 staðalvik"), so a reader comparing a row against
// the note above the table needs to see it at the precision the note implies.
const formatSpreads = (value: number | null | undefined): string => {
  if (value == null) return dash
  const roundedValue = Math.round(value * 100) / 100
  const sign = roundedValue > 0 ? '+' : ''
  return `${sign}${roundedValue.toFixed(2).replace('.', ',')}`
}

// The pool figures are plain counts, but they count a whole workforce — four
// digits on a large company — so they take the same is-IS grouping as every
// other figure in the report rather than being interpolated raw.
const formatCount = (value: number): string =>
  value.toLocaleString('is-IS', { maximumFractionDigits: 0 })

const blockerMessage = (
  code: PayDispersionBlocker,
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
): string => {
  const m = messages.salaryAnalysis.payDispersion
  switch (code) {
    case 'COHORT_TOO_SMALL':
      return formatMessage(m.blockerCohortTooSmall)
    case 'NO_SCORE_VARIATION':
      return formatMessage(m.blockerNoScoreVariation)
    case 'GAP_NOT_COMPUTABLE':
      return formatMessage(m.blockerGapNotComputable)
    default:
      return code
  }
}

/**
 * What a column sorts on — the underlying figure for the numeric columns, and
 * the RENDERED label for Kyn.
 *
 * Kyn sorts by its label rather than by the enum so the grouping a reader gets
 * is the alphabetical one they can see. The enum order happens to agree in
 * Icelandic (Karl, Kona, Kynsegin) and would not in a locale where it doesn't.
 */
const sortValue = (
  employee: PayDispersionEmployee,
  key: SortKey,
  genderLabel: (employee: PayDispersionEmployee) => string,
): number | string => {
  switch (key) {
    case 'ordinal':
      return employee.employeeOrdinal
    case 'gender':
      return genderLabel(employee)
    case 'score':
      return employee.score
    case 'wage':
      return employee.regularHourlyWage
    case 'expected':
      return employee.expectedHourlyWage
    // Signed, both of them, matching what the column prints. A row can be listed
    // for sitting far ABOVE the line as easily as far below it, so sorting these
    // on magnitude would collapse the one distinction the list exists to draw.
    case 'deviation':
      return employee.deviationPercent
    case 'spread':
      return employee.studentizedResidual
  }
}

const sortEmployees = (
  employees: PayDispersionEmployee[],
  sort: SortState,
  genderLabel: (employee: PayDispersionEmployee) => string,
): PayDispersionEmployee[] => {
  if (!sort) return employees

  const direction = sort.direction === 'asc' ? 1 : -1

  // A copy, because `employees` is owned by the analysis result SalaryAnalysisResults
  // holds in state and sort() reorders in place — sorting the prop would rewrite
  // the server's ranking inside that state object, and the third activation
  // would then have nothing to return to.
  //
  // Array#sort is stable (ES2019 on), so rows that tie on the chosen column keep
  // the server's ranking relative to each other instead of being shuffled.
  return [...employees].sort((a, b) => {
    const left = sortValue(a, sort.key, genderLabel)
    const right = sortValue(b, sort.key, genderLabel)
    return typeof left === 'string' && typeof right === 'string'
      ? left.localeCompare(right, 'is') * direction
      : (Number(left) - Number(right)) * direction
  })
}

type Props = {
  payDispersion?: PayDispersionDto | null
}

export const PayDispersionTable = ({ payDispersion }: Props) => {
  const { formatMessage } = useLocale()
  // Above the guards below on purpose: those return early on the shape of the
  // data, and a payDispersion that arrives, goes away and comes back would
  // otherwise change how many hooks this component calls between renders.
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)

  const p = messages.salaryAnalysis.payDispersion
  // The column headers, the ordinal tooltip and the deviation wording are read
  // from the úrbótaáætlun namespace rather than restated here. Two sets of ids
  // would be two Contentful entries a translator could drift apart, and this
  // table's own `numberHeader`/`salary`/`deviationHeader` ids already carry
  // published translations ("Auðkenni", "Tímakaup", "Launafrávik") that would
  // win over any renamed defaultMessage — so reusing the ids is the only way the
  // two tables are guaranteed to say the same thing.
  const o = messages.salaryAnalysis.outlierGroup

  if (!payDispersion) return null

  if (
    payDispersion.available &&
    payDispersion.population !== RENDERED_POPULATION
  ) {
    return null
  }

  // Resolved once per render, not once per comparison. `genderLabel` is called
  // from inside the Kyn comparator, so reading it straight off formatMessage put
  // ~2n·log n message lookups behind every render that sorts by Kyn. There are
  // only three genders, so a lookup table costs three calls whatever n is.
  const genderLabels: Record<PayDispersionEmployee['gender'], string> = {
    MALE: formatSalaryAnalysisGenderLabel('MALE', formatMessage),
    FEMALE: formatSalaryAnalysisGenderLabel('FEMALE', formatMessage),
    NEUTRAL: formatSalaryAnalysisGenderLabel('NEUTRAL', formatMessage),
  }
  const genderLabel = (employee: PayDispersionEmployee) =>
    genderLabels[employee.gender]

  // Not memoised. The list is capped at 100 rows by the API, nothing keys an
  // effect on this array (it feeds a plain <table>, not the InteractiveTable the
  // úrbótaáætlun uses), and `formatMessage` — which the Kyn comparator needs —
  // is a fresh arrow out of every useLocale() call, so a memo over it would
  // recompute on every render while implying it does not.
  const rows = sortEmployees(payDispersion.employees, sort, genderLabel)

  // One row cannot be reordered and cannot be paged, so it gets neither control.
  const sortable = rows.length > 1
  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / PAY_DISPERSION_PAGE_SIZE),
  )
  // Clamped on render rather than reset from an effect: a re-run analysis that
  // returns a shorter list simply lands the reader on the last page that still
  // exists. Same idiom as the úrbótaáætlun table.
  const currentPage = Math.min(page, totalPages)
  const pageRows = rows.slice(
    (currentPage - 1) * PAY_DISPERSION_PAGE_SIZE,
    currentPage * PAY_DISPERSION_PAGE_SIZE,
  )

  // Back to the first page on every re-sort: the rows the reader was looking at
  // are not the rows that will be under them afterwards, so holding page 3 drops
  // them into the middle of an order they have not seen the top of.
  const toggleSort = (key: SortKey) => {
    setPage(1)
    setSort((previous) => {
      if (previous?.key !== key) return { key, direction: 'asc' }
      if (previous.direction === 'asc') return { key, direction: 'desc' }
      // Third activation returns to the server's ranking — see SortState.
      return null
    })
  }

  const ariaSortFor = (
    key: SortKey,
  ): 'ascending' | 'descending' | 'none' | undefined => {
    if (!sortable) return undefined
    if (sort?.key !== key) return 'none'
    return sort.direction === 'asc' ? 'ascending' : 'descending'
  }

  const sortControl = (
    key: SortKey,
    label: string,
    align: 'left' | 'right' = 'left',
  ): ReactNode => {
    if (!sortable) return label

    const active = sort?.key === key

    return (
      <FocusableBox
        component="button"
        type="button"
        display="flex"
        alignItems="center"
        justifyContent={align === 'right' ? 'flexEnd' : 'flexStart'}
        columnGap={1}
        color="blue"
        className={styles.sortButton}
        // Says what activating does; which way the column stands right now is
        // aria-sort's job on the cell around it.
        aria-label={formatMessage(p.sortColumnLabel, { column: label })}
        onClick={() => toggleSort(key)}
      >
        {label}
        {/* Reserved rather than removed: dropping the caret out of the flow
            would shift every header sideways the moment one is sorted. */}
        <Box
          aria-hidden="true"
          display="flex"
          style={{ visibility: active ? 'visible' : 'hidden' }}
        >
          <Icon
            color="blue400"
            icon={
              active && sort?.direction === 'desc' ? 'caretDown' : 'caretUp'
            }
            size="small"
          />
        </Box>
      </FocusableBox>
    )
  }

  return (
    <Box marginBottom={4}>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(p.heading)}
      </Text>

      {!payDispersion.available ? (
        <Box>
          {payDispersion.blockers.map((code) => (
            <Text key={code} variant="small" color="dark350">
              {blockerMessage(code, formatMessage)}
            </Text>
          ))}
        </Box>
      ) : payDispersion.employees.length === 0 ? (
        <Text variant="small" color="dark350">
          {formatMessage(p.allClear)}
        </Text>
      ) : (
        <>
          <Text marginBottom={1}>{formatMessage(p.intro)}</Text>
          <Text marginBottom={2} fontWeight="semiBold">
            {formatMessage(p.noObligation)}
          </Text>
          {/* One block, so `counts` can never be separated from `listRule` —
              see the note on those two messages. The spread band is the only
              line of the three that can be missing. */}
          <Box marginBottom={2}>
            {payDispersion.cohortResidualSpreadPercentUp != null &&
              payDispersion.cohortResidualSpreadPercentDown != null && (
                <Text variant="small" color="dark350">
                  {formatMessage(p.spreadNote, {
                    down: `${formatSignedPercentMagnitude(
                      payDispersion.cohortResidualSpreadPercentDown,
                    )}%`,
                    up: `${formatSignedPercentMagnitude(
                      payDispersion.cohortResidualSpreadPercentUp,
                    )}%`,
                  })}
                </Text>
              )}
            <Text variant="small" color="dark350">
              {formatMessage(p.counts, {
                threshold: String(payDispersion.threshold).replace('.', ','),
                below: formatCount(payDispersion.countBelowExpected),
                above: formatCount(payDispersion.countAboveExpected),
              })}
            </Text>
            <Text variant="small" color="dark350">
              {formatMessage(p.listRule)}
            </Text>
          </Box>

          <T.Table>
            {/* Sighted readers get the sort affordance from the carets and the
                pointer; this is the only place the three-state cycle is spelled
                out, so it is rendered only while there is something to sort. */}
            {sortable && (
              <caption>
                <VisuallyHidden>{formatMessage(p.tableCaption)}</VisuallyHidden>
              </caption>
            )}
            <T.Head>
              <T.Row>
                <HeadCell ariaSort={ariaSortFor('ordinal')}>
                  {/* The tooltip stays outside the sort button — see the note on
                      EmployeeOrdinalHeader's renderLabel. */}
                  <EmployeeOrdinalHeader
                    renderLabel={(label) => sortControl('ordinal', label)}
                  />
                </HeadCell>
                <HeadCell ariaSort={ariaSortFor('gender')}>
                  {sortControl('gender', formatMessage(o.genderColumn))}
                </HeadCell>
                <HeadCell align="right" ariaSort={ariaSortFor('score')}>
                  {sortControl('score', formatMessage(o.stigColumn), 'right')}
                </HeadCell>
                <HeadCell align="right" ariaSort={ariaSortFor('wage')}>
                  {sortControl(
                    'wage',
                    formatMessage(o.hourlyWageColumn),
                    'right',
                  )}
                </HeadCell>
                <HeadCell align="right" ariaSort={ariaSortFor('expected')}>
                  {sortControl(
                    'expected',
                    formatMessage(o.expectedHourlyWageColumn),
                    'right',
                  )}
                </HeadCell>
                <HeadCell align="right" ariaSort={ariaSortFor('deviation')}>
                  {sortControl(
                    'deviation',
                    formatMessage(o.deviationColumn),
                    'right',
                  )}
                </HeadCell>
                {/* The one column with no counterpart in the úrbótaáætlun
                    table, and it stays: it is the figure that both put the row
                    in the pool and ranked it onto this list, stated in the same
                    units as the threshold in the note above. */}
                <HeadCell align="right" ariaSort={ariaSortFor('spread')}>
                  {sortControl(
                    'spread',
                    formatMessage(p.spreadHeader),
                    'right',
                  )}
                </HeadCell>
              </T.Row>
            </T.Head>
            <T.Body>
              {pageRows.map((employee) => (
                <T.Row key={employee.employeeOrdinal}>
                  <DataCell>{employee.employeeOrdinal}</DataCell>
                  <DataCell>{genderLabel(employee)}</DataCell>
                  <DataCell align="right">
                    {formatStig(employee.score)}
                  </DataCell>
                  <DataCell align="right">
                    {formatWageAmount(employee.regularHourlyWage)}
                  </DataCell>
                  <DataCell align="right">
                    {formatWageAmount(employee.expectedHourlyWage)}
                  </DataCell>
                  <DataCell align="right">
                    {formatDeviationLabel(
                      employee.deviationPercent,
                      employee.payStatus,
                      formatMessage,
                    )}
                  </DataCell>
                  <DataCell align="right">
                    {formatSpreads(employee.studentizedResidual)}
                  </DataCell>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>

          {/* Carries the unit the wage columns dropped, once — same footnote,
              same placement and same message as under the úrbótaáætlun table.
              Above the pager, because it annotates the table, not the page. */}
          <Box marginTop={1}>
            <Text variant="small" color="dark400">
              {formatMessage(o.wageUnitFootnote)}
            </Text>
          </Box>

          {/* Renders nothing at all while the whole list fits on one page, which
              on the API's soft cap of 20 is the ordinary report. */}
          <Box marginTop={2}>
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Box>
        </>
      )}
    </Box>
  )
}
