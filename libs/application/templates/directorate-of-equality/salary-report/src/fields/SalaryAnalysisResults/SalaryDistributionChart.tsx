import { FC } from 'react'

import type {
  SalaryAnalysisResponseDto,
  SalaryByGenderAndScoreDto,
  WageGapDecompositionDto,
  WageGapEmployeeDto,
  WageGapPooledFitDto,
} from '@island.is/clients/directorate-of-equality'
import {
  Box,
  Divider,
  ScatterChart,
  ScatterChartPoint,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { messages } from '../../lib/messages'
import {
  formatDeviationLabel,
  formatSalaryAnalysisGenderLabel,
} from '../../utils/salaryAnalysisLabels'
import { hasIdentifiableRegressionFit } from '../../utils/wageGap'
import { formatHourlyWage } from '../EmployeesEditor/utils'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']

type Props = {
  data?: SalaryByGenderAndScoreDto | null
  decomposition?: WageGapDecompositionDto | null
  payDispersion?: PayDispersionDto | null
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
  payDispersionOrdinals: Set<number> | null,
): boolean => {
  if (decomposition.oskyrtWithinBenchmark === false) {
    return employee.inMinimumSet
  }

  return (
    decomposition.oskyrtWithinBenchmark === true &&
    payDispersionOrdinals?.has(employee.ordinal) === true
  )
}

const toScatterPoint = (
  point: ChartPoint,
  markedLabel: string | null,
  markedIsDeviation: boolean,
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
): ScatterChartPoint => {
  const tooltipMessages = messages.salaryAnalysis.chartTooltip
  const employee = point.employee
  const rows: { label: string; value: string }[] = []

  if (employee) {
    rows.push({
      label: formatMessage(tooltipMessages.gender),
      value: formatSalaryAnalysisGenderLabel(employee.gender, formatMessage),
    })
  }
  rows.push({
    label: formatMessage(tooltipMessages.score),
    value: String(Math.round(point.score)),
  })
  rows.push({
    label: formatMessage(tooltipMessages.salary),
    value: formatHourlyWage(point.regularHourlyWage),
  })
  if (employee) {
    rows.push({
      label: formatMessage(tooltipMessages.expected),
      value: formatHourlyWage(employee.expectedHourlyWage),
    })
    rows.push({
      label: formatMessage(tooltipMessages.deviation),
      // The shared helper, not a locally assembled string: this is the same
      // figure the úrbótaáætlun and ábendingar tables show, so it goes through
      // the same localised `deviationCell` template rather than hardcoding the
      // "{value}% ({status})" shape a third time.
      value: formatDeviationLabel(
        employee.deviationPercent,
        employee.payStatus,
        formatMessage,
      ),
    })
  }

  return {
    x: point.score,
    y: point.regularHourlyWage,
    marked: point.marked,
    tooltip: {
      title: employee
        ? `${formatMessage(tooltipMessages.employee)} ${employee.ordinal}`
        : formatMessage(messages.salaryAnalysis.chart.title),
      rows,
      note:
        point.marked && markedLabel
          ? {
              text: markedLabel,
              color: markedIsDeviation ? 'red600' : undefined,
            }
          : undefined,
    },
  }
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

  // xSumSquares is the identifiability test the API documents — a degenerate fit
  // comes back with slope 0, not null, which would otherwise be printed as a
  // confident "0,0% á hver 100 stig".
  if (!hasIdentifiableRegressionFit(fit)) {
    return (
      <Text variant="small" color="dark300">
        {formatMessage(t.unavailable)}
      </Text>
    )
  }

  // exp(slope · 100) − 1: the compounded proportional rise over 100 stig. Not
  // slope · 100, which is the log-space increment and understates it.
  const growthPercent = (Math.exp(fit.slope * 100) - 1) * 100

  // A real point ON the curve, at the cohort's own mean score — deliberately not
  // exp(intercept), which is pay at zero stig: outside any support, and easy to
  // misread as a floor.
  const expectedAtMeanScore =
    fit.xMean != null ? Math.exp(fit.intercept + fit.slope * fit.xMean) : null

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
}) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.chart

  if (!data) return null

  const fit = decomposition?.pooledFit
  const hasFit = hasIdentifiableRegressionFit(fit)
  const predict = (score: number) =>
    hasFit ? Math.exp(fit.intercept + fit.slope * score) : 0
  const payDispersionMarkedOrdinals =
    payDispersion?.available &&
    payDispersion.population === RENDERED_PAY_DISPERSION_POPULATION
      ? new Set(payDispersion.employees.map((row) => row.employeeOrdinal))
      : null

  const points: ChartPoint[] = decomposition?.employees?.length
    ? decomposition.employees.map((employee) => ({
        score: employee.score,
        regularHourlyWage: employee.hourlyWage,
        gender: employee.gender,
        employee,
        marked: isMarked(employee, decomposition, payDispersionMarkedOrdinals),
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
  const markedIsDeviation = decomposition?.oskyrtWithinBenchmark === false
  const markedLabel = markedIsDeviation
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

  const tooltipMarkedLabel = hasMarked ? markedLabel : null
  const toPoint = (point: ChartPoint) =>
    toScatterPoint(point, tooltipMarkedLabel, markedIsDeviation, formatMessage)

  return (
    <Box display="flex" flexDirection="column" rowGap={2} marginBottom={4}>
      <Text variant="h4" as="h3">
        {formatMessage(m.title)}
      </Text>
      <Text>{formatMessage(m.intro)}</Text>

      <ScatterChart
        title={formatMessage(m.title)}
        description={formatMessage(m.intro)}
        series={[
          {
            name: formatMessage(m.legendMale),
            color: 'blue400',
            points: malePoints.map(toPoint),
          },
          {
            name: formatMessage(m.legendNonMale),
            color: 'purple400',
            points: femalePoints.map(toPoint),
          },
        ]}
        line={
          regressionData.length > 0
            ? {
                name: formatMessage(m.legendCurve),
                color: 'roseTinted400',
                points: regressionData.map((point) => ({
                  x: point.score,
                  y: point.regularHourlyWage,
                })),
              }
            : undefined
        }
        markedLegendLabel={tooltipMarkedLabel ?? undefined}
        xAxis={{
          label: formatMessage(m.xAxisLabel),
          domain: [0, xAxisMax],
          ticks: Array.from(
            { length: Math.ceil(xAxisMax / 250) + 1 },
            (_, i) => i * 250,
          ),
        }}
        yAxis={{
          label: formatMessage(m.yAxisLabel),
          domain: [0, yMax],
          ticks: yTicks,
          tickFormatter: formatSalary,
          width: Y_AXIS_WIDTH,
        }}
      />

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
