import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { formatCurrencyWithoutSuffix } from '@island.is/shared/utils'
import { messages } from '../../lib/messages'
import {
  hasNoPayComponents,
  type PayComponentGenderBreakdown,
  type PayComponentsBreakdown,
} from '../../utils/payComponents'
import { formatSignedPercentMagnitude } from '../../utils/wageGap'
import * as styles from './SalaryDistributionChart.css'

const MALE_COLOR = theme.color.blue400
const FEMALE_COLOR = theme.color.purple400
const CHART_HEIGHT = 260
// Headroom above the tallest bar so its value label is not clipped.
const LABEL_HEADROOM = 1.2

type Component = keyof Pick<
  PayComponentGenderBreakdown,
  'averageAdditionalSalary' | 'averageBonusSalary' | 'averageTotal'
>

type BarDatum = { label: string; value: number; fill: string }

type Props = {
  data?: PayComponentsBreakdown | null
}

const formatAmount = (value: unknown) =>
  formatCurrencyWithoutSuffix(Math.round(Number(value ?? 0)))

const ComponentChart = ({
  title,
  bars,
  footer,
}: {
  title: string
  bars: BarDatum[]
  footer: string[]
}) => {
  const max = Math.max(...bars.map((bar) => bar.value), 0)
  const yMax = max > 0 ? max * LABEL_HEADROOM : 1
  // The svg itself only exposes loose tick and value text, so the chart is
  // announced as one image carrying the same figures the bars show.
  const ariaLabel = `${title}: ${bars
    .map((bar) => `${bar.label} ${formatAmount(bar.value)}`)
    .join(', ')}`

  return (
    <Box flexGrow={1} style={{ minWidth: 0, flexBasis: 0 }}>
      <Text variant="h5" textAlign="center">
        {title}
      </Text>
      <Box role="img" aria-label={ariaLabel}>
        <ResponsiveContainer
          width="100%"
          height={CHART_HEIGHT}
          className={styles.chartFocus}
        >
          <BarChart
            data={bars}
            margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
            accessibilityLayer={false}
          >
            <CartesianGrid vertical={false} stroke={theme.color.blue200} />
            <XAxis
              dataKey="label"
              stroke={theme.color.dark300}
              tickLine={false}
              tick={{ fill: theme.color.dark400, fontSize: 14 }}
              interval={0}
            />
            <YAxis hide domain={[0, yMax]} tickCount={3} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              maxBarSize={72}
              // Recharts drops zero-height bars and their labels; a group whose
              // average is 0 still gets a sliver and its "0".
              minPointSize={1}
              isAnimationActive={false}
            >
              {bars.map((bar) => (
                <Cell key={bar.label} fill={bar.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={formatAmount}
                fill={theme.color.dark400}
                fontSize={14}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box marginTop={2}>
        {footer.map((line) => (
          <Text key={line} variant="small" textAlign="center">
            {line}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

export const PayComponentsChart = ({ data }: Props) => {
  const { formatMessage } = useLocale()
  const t = messages.salaryAnalysis.components

  if (!data || data.overall.count === 0) return null

  // A group with nobody in it gets no bar rather than a zero bar, which would
  // read as "they get nothing" — the same reason the table showed a dash.
  const groups = [
    { breakdown: data.male, label: formatMessage(t.male), fill: MALE_COLOR },
    {
      breakdown: data.female,
      label: formatMessage(t.female),
      fill: FEMALE_COLOR,
    },
  ].filter((group) => group.breakdown.count > 0)

  const charts: {
    title: string
    component: Component
    gapPercent: number | null
  }[] = [
    {
      title: formatMessage(t.additionalHeader),
      component: 'averageAdditionalSalary',
      gapPercent: data.additionalWageGapPercent,
    },
    {
      title: formatMessage(t.bonusHeader),
      component: 'averageBonusSalary',
      gapPercent: data.bonusWageGapPercent,
    },
    {
      title: formatMessage(t.totalHeader),
      component: 'averageTotal',
      gapPercent: data.totalWageGapPercent,
    },
  ]

  // The gap is null when one group is empty or men's average is 0; the line
  // is left out then rather than printed as a dash under every chart.
  const footerFor = (chart: typeof charts[number]) => [
    `${formatMessage(t.overall)} (${data.overall.count}): ${formatAmount(
      data.overall[chart.component],
    )}`,
    ...(chart.gapPercent == null
      ? []
      : [
          `${formatMessage(t.gapRow)}: ${formatSignedPercentMagnitude(
            chart.gapPercent,
          )}%`,
        ]),
  ]
  const hasAnyGap = charts.some((chart) => chart.gapPercent != null)

  return (
    <Box marginBottom={4}>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(t.heading)}
      </Text>
      <Text marginBottom={3}>{formatMessage(t.description)}</Text>
      {hasNoPayComponents(data) ? (
        <Text variant="small" color="dark300">
          {formatMessage(t.empty)}
        </Text>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection={['column', 'column', 'row']}
            columnGap={3}
            rowGap={4}
          >
            {charts.map((chart) => (
              <ComponentChart
                key={chart.component}
                title={chart.title}
                bars={groups.map((group) => ({
                  label: group.label,
                  value: group.breakdown[chart.component],
                  fill: group.fill,
                }))}
                footer={footerFor(chart)}
              />
            ))}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            columnGap={3}
            flexWrap="wrap"
            marginTop={2}
          >
            {groups.map((group) => (
              <Box
                key={group.label}
                display="flex"
                alignItems="center"
                columnGap={1}
              >
                <svg width={12} height={12} aria-hidden>
                  <rect width={12} height={12} rx={2} fill={group.fill} />
                </svg>
                <Text variant="small">
                  {`${group.label} (${group.breakdown.count})`}
                </Text>
              </Box>
            ))}
          </Box>
          {hasAnyGap && (
            <Box marginTop={2}>
              <Text variant="small" color="dark300">
                {formatMessage(t.gapHint)}
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
