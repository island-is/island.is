import { FC, ReactNode } from 'react'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import type {
  SalaryAnalysisResponseDto,
  SalaryByGenderAndScoreDto,
  WageGapDecompositionDto,
  WageGapEmployeeDto,
  WageGapPooledFitDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatHourlyWage } from '../EmployeesEditor/utils'
import { formatPercentMagnitude } from '../../utils/wageGap'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']

type Props = {
  data?: SalaryByGenderAndScoreDto | null
  decomposition?: WageGapDecompositionDto | null
  payDispersion?: PayDispersionDto | null
  identifierForOrdinal: (ordinal: number) => string
}

type ChartPoint = {
  score: number
  regularHourlyWage: number
  gender: WageGapEmployeeDto['gender']
  employee: WageGapEmployeeDto | null
  marked: boolean
}

const RENDERED_PAY_DISPERSION_POPULATION: PayDispersionDto['population'] =
  'ALL_EMPLOYEES'
const NICE_AXIS_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]
const CURVE_SAMPLES = 48
// Wide enough for the formatted krónur ticks. The label that sits above it is
// the bare unit ("kr./klst."), short enough to centre on the axis — a full
// phrase here overflows the container and gets clipped on the left.
const Y_AXIS_WIDTH = 95

const formatSalary = (value: number) =>
  new Intl.NumberFormat('is-IS').format(Math.round(value)).replaceAll(',', '.')

const niceAxisMax = (dataMax: number) => {
  if (!Number.isFinite(dataMax) || dataMax <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(dataMax))
  const normalised = dataMax / magnitude
  const step =
    NICE_AXIS_STEPS.find((candidate) => normalised <= candidate) ?? 10
  return step * magnitude
}

const isMarked = (
  employee: WageGapEmployeeDto,
  decomposition: WageGapDecompositionDto,
  payDispersion: PayDispersionDto | null | undefined,
): boolean => {
  if (decomposition.oskyrtWithinBenchmark === false) {
    return employee.inMinimumSet
  }

  if (
    decomposition.oskyrtWithinBenchmark !== true ||
    !payDispersion?.available ||
    payDispersion.population !== RENDERED_PAY_DISPERSION_POPULATION
  ) {
    return false
  }

  return payDispersion.employees.some(
    (row) => row.employeeOrdinal === employee.ordinal,
  )
}

const NoSymbol = () => <g />

const EmployeeDot = ({
  cx,
  cy,
  fill,
  payload,
}: {
  cx?: number
  cy?: number
  fill?: string
  payload?: ChartPoint
}) => {
  if (cx == null || cy == null) return null
  const marked = payload?.marked === true

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={marked ? 6 : 4}
        fill={fill}
        fillOpacity={marked ? 1 : 0.8}
        stroke={marked ? theme.color.dark400 : 'none'}
        strokeWidth={marked ? 2 : 0}
        pointerEvents="none"
      />
    </g>
  )
}

const isChartPoint = (datum: unknown): datum is ChartPoint =>
  typeof datum === 'object' &&
  datum !== null &&
  'employee' in datum &&
  'gender' in datum

const payStatusWord = (
  payStatus: WageGapEmployeeDto['payStatus'],
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
) => {
  const m = messages.salaryAnalysis.outlierGroup
  return formatMessage(
    payStatus === 'UNDERPAID'
      ? m.payStatusUnderpaid
      : payStatus === 'OVERPAID'
      ? m.payStatusOverpaid
      : m.payStatusOnLine,
  )
}

const genderLabel = (
  gender: WageGapEmployeeDto['gender'],
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
): string => {
  const m = messages.salaryAnalysis.payDispersion
  if (gender === 'MALE') return formatMessage(m.genderMale)
  if (gender === 'FEMALE') return formatMessage(m.genderFemale)
  return formatMessage(m.genderNeutral)
}

const ChartTooltip = ({
  active,
  payload,
  markedLabel,
  identifierForOrdinal,
  formatMessage,
}: Partial<TooltipContentProps<number, string>> & {
  markedLabel: string | null
  identifierForOrdinal: (ordinal: number) => string
  formatMessage: ReturnType<typeof useLocale>['formatMessage']
}) => {
  const datum = active ? payload?.[0]?.payload : undefined
  if (!isChartPoint(datum)) return null

  const tooltipMessages = messages.salaryAnalysis.chartTooltip
  const employee = datum.employee
  const rows: [string, string][] = []

  if (employee) {
    rows.push([
      formatMessage(tooltipMessages.gender),
      genderLabel(employee.gender, formatMessage),
    ])
  }
  rows.push([
    formatMessage(tooltipMessages.score),
    String(Math.round(datum.score)),
  ])
  rows.push([
    formatMessage(tooltipMessages.salary),
    formatHourlyWage(datum.regularHourlyWage),
  ])

  if (employee) {
    const sign =
      employee.deviationPercent > 0
        ? '+'
        : employee.deviationPercent < 0
        ? '-'
        : ''
    rows.push([
      formatMessage(tooltipMessages.expected),
      formatHourlyWage(employee.expectedHourlyWage),
    ])
    rows.push([
      formatMessage(tooltipMessages.deviation),
      `${sign}${formatPercentMagnitude(
        employee.deviationPercent,
      )}% (${payStatusWord(employee.payStatus, formatMessage)})`,
    ])
  }

  return (
    <Box
      background="white"
      borderRadius="standard"
      padding={2}
      style={{
        border: `1px solid ${theme.color.blue200}`,
        boxShadow: '0 2px 8px rgba(0, 0, 60, 0.12)',
      }}
    >
      <Text variant="small" fontWeight="semiBold">
        {employee
          ? `${formatMessage(tooltipMessages.employee)} ${identifierForOrdinal(
              employee.ordinal,
            )}`
          : formatMessage(messages.salaryAnalysis.chart.title)}
      </Text>
      {rows.map(([label, value]) => (
        <Box key={label} display="flex" columnGap={1}>
          <Text variant="small" color="dark350">
            {label}:
          </Text>
          <Text variant="small">{value}</Text>
        </Box>
      ))}
      {datum.marked && markedLabel && (
        <Box marginTop={1}>
          <Text variant="small" fontWeight="semiBold">
            {markedLabel}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const ChartLegend = ({
  hasMale,
  hasFemale,
  hasCurve,
  markedLabel,
}: {
  hasMale: boolean
  hasFemale: boolean
  hasCurve: boolean
  markedLabel: string | null
}) => {
  const { formatMessage } = useLocale()
  const items: { label: string; swatch: ReactNode }[] = []
  const dot = (fill: string) => (
    <svg width={12} height={12} aria-hidden>
      <circle cx={6} cy={6} r={5} fill={fill} fillOpacity={0.8} />
    </svg>
  )

  if (hasMale) {
    items.push({
      label: formatMessage(messages.salaryAnalysis.payDispersion.genderMale),
      swatch: dot(theme.color.blue400),
    })
  }
  if (hasFemale) {
    items.push({
      label: formatMessage(messages.salaryAnalysis.payDispersion.genderFemale),
      swatch: dot(theme.color.purple400),
    })
  }
  if (hasCurve) {
    items.push({
      label: formatMessage(messages.salaryAnalysis.chart.legendCurve),
      swatch: (
        <svg width={16} height={12} aria-hidden>
          <line
            x1={0}
            y1={6}
            x2={16}
            y2={6}
            stroke={theme.color.roseTinted400}
            strokeWidth={2.5}
          />
        </svg>
      ),
    })
  }
  if (markedLabel) {
    items.push({
      label: markedLabel,
      swatch: (
        <svg width={14} height={14} aria-hidden>
          <circle
            cx={7}
            cy={7}
            r={5}
            fill="none"
            stroke={theme.color.dark400}
            strokeWidth={2}
          />
        </svg>
      ),
    })
  }

  return (
    <Box display="flex" justifyContent="center" columnGap={3} flexWrap="wrap">
      {items.map((item) => (
        <Box key={item.label} display="flex" alignItems="center" columnGap={1}>
          {item.swatch}
          <Text variant="small">{item.label}</Text>
        </Box>
      ))}
    </Box>
  )
}

/**
 * The curve in words: how fast it rises, and one real point on it.
 *
 * Ritstjórn also prints R² here; the application deliberately does not. It
 * answers "how much do the stig explain", a question for whoever reviews the
 * report rather than for the employer filling it in.
 */
const RegressionReadout = ({ fit }: { fit?: WageGapPooledFitDto | null }) => {
  const { formatMessage } = useLocale()
  const t = messages.salaryAnalysis.chartRegression
  const slope = fit?.slope ?? null
  const intercept = fit?.intercept ?? null

  // xSumSquares is the identifiability test the API documents — a degenerate fit
  // comes back with slope 0, not null, which would otherwise be printed as a
  // confident "0,0% á hver 100 stig".
  if (!fit || fit.xSumSquares <= 0 || slope == null) {
    return (
      <Text variant="small" color="dark300">
        {formatMessage(t.unavailable)}
      </Text>
    )
  }

  // exp(slope · 100) − 1: the compounded proportional rise over 100 stig. Not
  // slope · 100, which is the log-space increment and understates it.
  const growthPercent = (Math.exp(slope * 100) - 1) * 100

  // A real point ON the curve, at the cohort's own mean score — deliberately not
  // exp(intercept), which is pay at zero stig: outside any support, and easy to
  // misread as a floor.
  const expectedAtMeanScore =
    intercept != null && fit.xMean != null
      ? Math.exp(intercept + slope * fit.xMean)
      : null

  const rows: { label: string; value: string; hint: string }[] = [
    {
      label: formatMessage(t.growthLabel),
      value: `${growthPercent.toLocaleString('is-IS', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`,
      hint: formatMessage(t.growthHint),
    },
  ]

  if (expectedAtMeanScore != null) {
    rows.push({
      label: formatMessage(t.atMeanLabel),
      value: formatHourlyWage(expectedAtMeanScore),
      hint: formatMessage(t.atMeanHint),
    })
  }

  return (
    <Box>
      <Box marginTop={0} marginBottom={1}>
        <Text variant="small" color="dark300">
          {formatMessage(t.note)}
        </Text>
      </Box>
      {rows.map((row) => (
        <Box
          key={row.label}
          display="flex"
          columnGap={2}
          marginTop={1}
          flexWrap="wrap"
        >
          <Text variant="small" fontWeight="semiBold">
            {row.label}
          </Text>
          <Text variant="small">{row.value}</Text>
          <Text variant="small" color="dark300">
            {row.hint}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

export const SalaryDistributionChart: FC<Props> = ({
  data,
  decomposition,
  payDispersion,
  identifierForOrdinal,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.chart

  if (!data) return null

  const fit = decomposition?.pooledFit
  const slope = fit?.slope ?? null
  const intercept = fit?.intercept ?? null
  const hasFit = slope != null && intercept != null
  const predict = (score: number) =>
    hasFit ? Math.exp(intercept + slope * score) : 0

  const points: ChartPoint[] = decomposition?.employees?.length
    ? decomposition.employees.map((employee) => ({
        score: employee.score,
        regularHourlyWage: employee.hourlyWage,
        gender: employee.gender,
        employee,
        marked: isMarked(employee, decomposition, payDispersion),
      }))
    : data.dataPoints.map((point) => ({
        score: point.score,
        regularHourlyWage: point.regularHourlyWage,
        gender: point.gender,
        employee: null,
        marked: false,
      }))

  if (points.length === 0) return null

  const malePoints = points.filter((point) => point.gender === 'MALE')
  const femalePoints = points.filter((point) => point.gender !== 'MALE')
  const markedLabel =
    decomposition?.oskyrtWithinBenchmark === false
      ? formatMessage(messages.salaryAnalysis.chartMarkedLegend.minimumSet)
      : decomposition?.oskyrtWithinBenchmark === true
      ? formatMessage(messages.salaryAnalysis.chartMarkedLegend.abending)
      : null
  const hasMarked = points.some((point) => point.marked)

  const scoreBucketMax =
    data.scoreBuckets.length > 0
      ? Math.max(...data.scoreBuckets.map((bucket) => bucket.rangeTo))
      : Math.max(...points.map((point) => point.score), 0)
  const xAxisMax = Math.max(250, Math.ceil((scoreBucketMax + 100) / 250) * 250)
  const scores = points.map((point) => point.score)
  const curveFrom = Math.min(...scores)
  const curveTo = Math.max(...scores)
  const regressionData = hasFit
    ? Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => {
        const score = curveFrom + ((curveTo - curveFrom) * i) / CURVE_SAMPLES
        return { score, regularHourlyWage: predict(score) }
      })
    : []

  const allY = [
    ...points.map((point) => point.regularHourlyWage),
    ...regressionData.map((point) => point.regularHourlyWage),
  ]
  const yMax = niceAxisMax(Math.max(...allY, 1))
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) =>
    Math.round(yMax * fraction),
  )

  return (
    <Box display="flex" flexDirection="column" rowGap={2} marginBottom={4}>
      <Text variant="h4">{formatMessage(m.title)}</Text>
      <Text>{formatMessage(m.intro)}</Text>

      <ResponsiveContainer width="100%" height={420}>
        <ScatterChart
          margin={{ top: 24, right: 0, left: 0, bottom: 24 }}
          style={{ outline: 'none' }}
        >
          <CartesianGrid vertical={false} stroke={theme.color.blue200} />
          <XAxis
            type="number"
            dataKey="score"
            domain={[0, xAxisMax]}
            ticks={Array.from(
              { length: Math.ceil(xAxisMax / 250) + 1 },
              (_, i) => i * 250,
            )}
            stroke={theme.color.blue200}
            tickLine={false}
            tick={{ fill: theme.color.black, fontSize: 14 }}
            label={{
              value: formatMessage(m.xAxisLabel),
              position: 'insideBottomRight',
              dx: 5,
              dy: 10,
              fontWeight: 'bold',
              fill: theme.color.black,
              fontSize: 14,
            }}
          />
          <YAxis
            type="number"
            dataKey="regularHourlyWage"
            domain={[0, yMax]}
            ticks={yTicks}
            tickFormatter={formatSalary}
            stroke={theme.color.blue200}
            tickLine={false}
            tick={{ fill: theme.color.black, fontSize: 14 }}
            width={Y_AXIS_WIDTH}
            label={{
              value: formatMessage(m.yAxisLabel),
              position: 'insideTop',
              offset: -22,
              fontWeight: 'bold',
              fill: theme.color.black,
              fontSize: 14,
              dx: 32,
            }}
          />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            shared={false}
            content={
              <ChartTooltip
                markedLabel={hasMarked ? markedLabel : null}
                identifierForOrdinal={identifierForOrdinal}
                formatMessage={formatMessage}
              />
            }
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            content={
              <ChartLegend
                hasMale={malePoints.length > 0}
                hasFemale={femalePoints.length > 0}
                hasCurve={regressionData.length > 0}
                markedLabel={hasMarked ? markedLabel : null}
              />
            }
          />
          {malePoints.length > 0 && (
            <Scatter
              name={formatMessage(
                messages.salaryAnalysis.payDispersion.genderMale,
              )}
              data={malePoints}
              fill={theme.color.blue400}
              legendType="none"
              shape={<EmployeeDot />}
            />
          )}
          {femalePoints.length > 0 && (
            <Scatter
              name={formatMessage(
                messages.salaryAnalysis.payDispersion.genderFemale,
              )}
              data={femalePoints}
              fill={theme.color.purple400}
              legendType="none"
              shape={<EmployeeDot />}
            />
          )}
          {regressionData.length > 0 && (
            <Scatter
              data={regressionData}
              name={formatMessage(m.legendCurve)}
              line={{
                stroke: theme.color.roseTinted400,
                strokeWidth: 2.5,
              }}
              lineType="joint"
              shape={<NoSymbol />}
              legendType="none"
              isAnimationActive={false}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      <RegressionReadout fit={fit} />

      {/* Closes the chart block before the extra-pay table. rowGap already
          supplies 16px above, so the extra 16px here matches the 32px the
          container's marginBottom leaves below — a divider only reads as a
          separator when the space either side of it is equal. */}
      <Box marginTop={2}>
        <Divider />
      </Box>
    </Box>
  )
}
