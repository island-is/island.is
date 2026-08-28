import type { ReactNode } from 'react'
import { Box, Table as T, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatWageAmount } from '../EmployeesEditor/utils'
import {
  formatDeviationLabel,
  formatSalaryAnalysisGenderLabel,
} from '../../utils/salaryAnalysisLabels'
import { formatSignedPercentMagnitude } from '../../utils/wageGap'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']
type PayDispersionBlocker = PayDispersionDto['blockers'][number]

const RENDERED_POPULATION: PayDispersionDto['population'] = 'ALL_EMPLOYEES'
const dash = '—'

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
 */
const HEADER_TEXT = { variant: 'small', fontWeight: 'semiBold' } as const

// `align` is forwarded as 'left' rather than left undefined: T.HeadData's own
// default is 'left', and passing undefined through would override that with
// nothing at all — leaving the `<th>` on the browser's centred default.
const HeadCell = ({
  children,
  align = 'left',
}: {
  children: ReactNode
  align?: 'left' | 'right'
}) => (
  <T.HeadData box={CELL_BOX} text={HEADER_TEXT} align={align}>
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

type Props = {
  payDispersion?: PayDispersionDto | null
}

export const PayDispersionTable = ({ payDispersion }: Props) => {
  const { formatMessage } = useLocale()
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
          {payDispersion.cohortResidualSpreadPercentUp != null &&
            payDispersion.cohortResidualSpreadPercentDown != null && (
              <Text variant="small" color="dark350" marginBottom={2}>
                {formatMessage(p.spreadNote, {
                  down: `${formatSignedPercentMagnitude(
                    payDispersion.cohortResidualSpreadPercentDown,
                  )}%`,
                  up: `${formatSignedPercentMagnitude(
                    payDispersion.cohortResidualSpreadPercentUp,
                  )}%`,
                  threshold: String(payDispersion.threshold).replace('.', ','),
                })}
              </Text>
            )}

          <T.Table>
            <T.Head>
              <T.Row>
                <HeadCell>
                  {/* The bare ordinal, as in the úrbótaáætlun table — it is the
                      number the applicant already knows from the employee
                      screens and the workbook, which the ABC-000 identifier
                      this column used to show is not. The tooltip is what says
                      so, and is the same one. */}
                  <Box display="flex" alignItems="center" columnGap={1}>
                    {formatMessage(o.ordinalColumn)}
                    <Tooltip
                      placement="right"
                      text={formatMessage(o.employeeColumnTooltip)}
                    />
                  </Box>
                </HeadCell>
                <HeadCell>{formatMessage(o.genderColumn)}</HeadCell>
                <HeadCell align="right">{formatMessage(o.stigColumn)}</HeadCell>
                <HeadCell align="right">
                  {formatMessage(o.hourlyWageColumn)}
                </HeadCell>
                <HeadCell align="right">
                  {formatMessage(o.expectedHourlyWageColumn)}
                </HeadCell>
                <HeadCell align="right">
                  {formatMessage(o.deviationColumn)}
                </HeadCell>
                {/* The one column with no counterpart in the úrbótaáætlun
                    table, and it stays: it is the figure that put the row on
                    this list, stated in the same units as the threshold in the
                    note above. */}
                <HeadCell align="right">
                  {formatMessage(p.spreadHeader)}
                </HeadCell>
              </T.Row>
            </T.Head>
            <T.Body>
              {payDispersion.employees.map((employee) => (
                <T.Row key={employee.employeeOrdinal}>
                  <DataCell>{employee.employeeOrdinal}</DataCell>
                  <DataCell>
                    {formatSalaryAnalysisGenderLabel(
                      employee.gender,
                      formatMessage,
                    )}
                  </DataCell>
                  <DataCell align="right">{employee.score}</DataCell>
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
              same placement and same message as under the úrbótaáætlun table. */}
          <Box marginTop={1}>
            <Text variant="small" color="dark400">
              {formatMessage(o.wageUnitFootnote)}
            </Text>
          </Box>
        </>
      )}
    </Box>
  )
}
