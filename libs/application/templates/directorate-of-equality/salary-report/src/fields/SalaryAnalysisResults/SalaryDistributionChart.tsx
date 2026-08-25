import { FC, useMemo } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import type {
  ScatterDataPointDto,
  WageGapPooledFitDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatHourlyWage } from '../EmployeesEditor/utils'

type Props = {
  dataPoints: ScatterDataPointDto[]
  pooledFit?: WageGapPooledFitDto | null
}

// How many points to sample the curve at. It is exp(a + b·stig), so a two-point
// line would draw a chord and visibly miss the curve it is meant to be.
const CURVE_SAMPLES = 60

/**
 * The curve is the pooled log fit — `Væntanlegt tímakaup`, the line every
 * `deviationPercent` in the outlier table is measured from. With a
 * two-directional minimum set the listed employees sit on BOTH sides of it.
 *
 * It bends because pay is fitted as a constant percentage rise per stig and a
 * percentage compounds; in krónur that is a curve. Do NOT swap in a level-space
 * linear fit to straighten it — such a fit predicts negative pay at the bottom
 * of the observed range and disagrees with the model the table uses, so a
 * reader can see a point above the drawn line whose row says "undir".
 */
export const SalaryDistributionChart: FC<Props> = ({
  dataPoints,
  pooledFit,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.chart

  const male = useMemo(
    () => dataPoints.filter((p) => p.gender === 'MALE'),
    [dataPoints],
  )
  const female = useMemo(
    () => dataPoints.filter((p) => p.gender !== 'MALE'),
    [dataPoints],
  )

  // xSumSquares is the identifiability test, not `slope != null`: a degenerate
  // fit from identical scores returns slope 0, which is a real finding (pay
  // flat across stig) and must still draw. Absent data must draw nothing — a
  // flat line there would read as that same finding.
  const fit = useMemo(() => {
    if (!pooledFit) return null
    const { slope, intercept, xRangeFrom, xRangeTo, xSumSquares } = pooledFit
    if (
      slope == null ||
      intercept == null ||
      xRangeFrom == null ||
      xRangeTo == null ||
      xSumSquares === 0
    ) {
      return null
    }
    return { slope, intercept, xRangeFrom, xRangeTo }
  }, [pooledFit])

  const curve = useMemo(() => {
    if (!fit) return []
    const { slope, intercept, xRangeFrom, xRangeTo } = fit
    const span = xRangeTo - xRangeFrom
    // Sampled across the OBSERVED range only — the curve is exponential and
    // extending it past the data distorts the axis.
    return Array.from({ length: CURVE_SAMPLES }, (_, i) => {
      const score = xRangeFrom + (span * i) / (CURVE_SAMPLES - 1)
      return { score, expected: Math.exp(intercept + slope * score) }
    })
  }, [fit])

  // The curve's own values must be in the domain: with a steep enough slope its
  // top end sits above every observed wage, and recharts' auto-domain would
  // clip the line at the plot edge.
  const yDomain = useMemo((): [number, number] => {
    const values = [
      ...dataPoints.map((p) => p.regularHourlyWage),
      ...curve.map((c) => c.expected),
    ]
    if (values.length === 0) return [0, 1]
    const min = Math.min(...values)
    const max = Math.max(...values)
    const pad = (max - min) * 0.05 || max * 0.05 || 1
    return [Math.max(0, min - pad), max + pad]
  }, [dataPoints, curve])

  const stats = useMemo(() => {
    if (!fit || !pooledFit) return null
    const { slope, intercept, xRangeFrom, xRangeTo } = fit
    // exp(step · slope) − 1: the compounded proportional rise, which is also
    // what explains the bend. The slope itself is in log units and means
    // nothing to a reader. Derive the step from the observed range — on a 3–15
    // score, "per 100 stig" would be nonsense.
    const span = xRangeTo - xRangeFrom
    const step = span >= 100 ? 100 : span >= 50 ? 50 : span >= 20 ? 20 : 10
    const growth = Math.exp(step * slope) - 1
    return {
      step,
      growth: Math.abs(growth * 100),
      rising: growth >= 0,
      // Anchored at the cohort's MEAN stig. Never print the intercept: exp(a)
      // is pay at zero stig, a score no job holds, and reads as a floor.
      anchorScore: pooledFit.xMean,
      anchorWage:
        pooledFit.xMean == null
          ? null
          : Math.exp(intercept + slope * pooledFit.xMean),
      rSquared: pooledFit.rSquared,
    }
  }, [fit, pooledFit])

  if (dataPoints.length === 0) return null

  return (
    <Box marginBottom={4}>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(m.title)}
      </Text>
      <Text variant="small" marginBottom={2}>
        {formatMessage(m.intro)}
      </Text>

      <Box style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 8, right: 16, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.color.blue200} />
            <XAxis
              type="number"
              dataKey="score"
              name={formatMessage(m.xAxisLabel)}
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="regularHourlyWage"
              name={formatMessage(m.yAxisLabel)}
              domain={yDomain}
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={(v: number) =>
                v.toLocaleString('is-IS', { maximumFractionDigits: 0 })
              }
            />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' ? formatHourlyWage(value) : ''
              }
              labelFormatter={(label) =>
                `${formatMessage(m.xAxisLabel)}: ${String(label ?? '')}`
              }
            />
            <Legend />
            <Scatter
              name={formatMessage(m.legendMale)}
              data={male}
              fill={theme.color.blue400}
            />
            <Scatter
              name={formatMessage(m.legendFemale)}
              data={female}
              fill={theme.color.purple400}
            />
            {curve.length > 0 && (
              <Line
                name={formatMessage(m.legendCurve)}
                data={curve}
                dataKey="expected"
                stroke={theme.color.red400}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {stats ? (
        <Box marginTop={1}>
          <Text variant="small">
            {formatMessage(stats.rising ? m.growthUp : m.growthDown, {
              pct: stats.growth.toLocaleString('is-IS', {
                maximumFractionDigits: 1,
              }),
              step: stats.step,
            })}
          </Text>
          {stats.anchorScore != null && stats.anchorWage != null && (
            <Text variant="small">
              {formatMessage(m.anchor, {
                score: stats.anchorScore.toLocaleString('is-IS', {
                  maximumFractionDigits: 0,
                }),
                wage: formatHourlyWage(stats.anchorWage),
              })}
            </Text>
          )}
          {stats.rSquared != null && (
            <Text variant="small">
              {formatMessage(m.rSquared, {
                value: stats.rSquared.toLocaleString('is-IS', {
                  maximumFractionDigits: 2,
                }),
              })}
            </Text>
          )}
        </Box>
      ) : (
        <Box marginTop={1}>
          <Text variant="small">{formatMessage(m.noFit)}</Text>
        </Box>
      )}
    </Box>
  )
}
