import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import round from 'lodash/round'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Box,
  Button,
  Inline,
  ProgressMeter,
  RadioButton,
  Stack,
  Table,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { MarkdownText } from '../../Organization'
import { m } from './Calculator.strings'
import * as styles from './Calculator.css'

const formatScore = (score: number) => {
  return String(round(score, 1)).replace('.', ',')
}

interface Question {
  question: string
  answerOptions: {
    score: number
    text?: string
  }[]
}

interface Step {
  title: string
  description: string
  questions: Question[]
}

interface CheckboxState {
  steps: {
    title: string
    questions: {
      selectedAnswerIndex: number
      answerScore: number
    }[]
  }[]
}

interface ECOIFormProps {
  step: Step
  stepIndex: number
  state: CheckboxState
  setState: Dispatch<SetStateAction<CheckboxState>>
}

const ECOIForm = ({ step, stepIndex, state, setState }: ECOIFormProps) => {
  const formState = state.steps[stepIndex]
  const { formatMessage } = useIntl()
  return (
    <Stack space={3}>
      <Stack space={3}>
        <Text variant="h2" as="h2">
          {step.title}
        </Text>
        <Text>{step.description}</Text>
      </Stack>
      <Stack space={5}>
        {step.questions.map(({ question, answerOptions }, questionIndex) => {
          const questionState = formState.questions[questionIndex]
          return (
            <Stack key={question} space={2}>
              <Text variant="h3" as="h3">
                {question}
              </Text>
              <Stack space={1}>
                {answerOptions.map((option, answerIndex) => {
                  const id = `${step.title}-${questionIndex}-${answerIndex}`
                  const groupName = `${stepIndex}-${questionIndex}`

                  if (answerIndex > 3) {
                    return null
                  }

                  const label =
                    option.text ||
                    formatMessage(
                      m.answerLabel[
                        String(answerIndex) as keyof typeof m.answerLabel
                      ],
                    )
                  return (
                    <RadioButton
                      key={id}
                      id={id}
                      name={groupName}
                      label={label}
                      value={label}
                      checked={
                        questionState.selectedAnswerIndex === answerIndex
                      }
                      onChange={() => {
                        questionState.selectedAnswerIndex = answerIndex
                        questionState.answerScore = option.score
                        setState((prevState) => ({ ...prevState }))
                      }}
                    />
                  )
                })}
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

export interface ECOICalculatorResultsProps {
  categoryAverages: { title: string; average: number }[]
  totalAverage: number
}

const getBracketText = (
  avg: number,
  formatMessage: ReturnType<typeof useIntl>['formatMessage'],
) => {
  if (avg >= 2.6) return formatMessage(m.results.bracket4Text)
  if (avg >= 1.8) return formatMessage(m.results.bracket3Text)
  if (avg >= 1.2) return formatMessage(m.results.bracket2Text)
  return formatMessage(m.results.bracket1Text)
}

const CHART_X_AXIS_TICKS = [0, 0.5, 1, 1.5, 2, 2.5, 3]
const CHART_CATEGORY_LABEL_MAX_LENGTH = 30

const CategoryAxisTick = (props: {
  x?: number
  y?: number
  payload?: { value: string }
}) => {
  const { x, y, payload } = props
  const value = payload?.value ?? ''
  const label =
    value.length > CHART_CATEGORY_LABEL_MAX_LENGTH
      ? `${value.slice(0, CHART_CATEGORY_LABEL_MAX_LENGTH - 1)}…`
      : value
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={0}
        dy={4}
        textAnchor="end"
        fontSize={13}
        fill={theme.color.dark400}
      >
        {label}
        <title>{value}</title>
      </text>
    </g>
  )
}

const RADAR_CATEGORY_LABEL_MAX_LENGTH = 20

const RadarCategoryTick = (props: {
  x?: number
  y?: number
  textAnchor?: 'start' | 'middle' | 'end'
  payload?: { value: string }
}) => {
  const { x = 0, y = 0, textAnchor = 'middle', payload } = props
  const value = payload?.value ?? ''
  const label =
    value.length > RADAR_CATEGORY_LABEL_MAX_LENGTH
      ? `${value.slice(0, RADAR_CATEGORY_LABEL_MAX_LENGTH - 1)}…`
      : value
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fontSize={12}
      fontWeight={600}
      fill={theme.color.dark400}
    >
      {label}
      <title>{value}</title>
    </text>
  )
}

const BarValueLabel = (props: {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: number
}) => {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props
  return (
    <text
      x={x + width - 8}
      y={y + height / 2}
      dy={4}
      textAnchor="end"
      fill={theme.color.white}
      fontSize={13}
      fontWeight={600}
    >
      {formatScore(value)}
    </text>
  )
}

export const ECOICalculatorResults = ({
  categoryAverages,
  totalAverage,
}: ECOICalculatorResultsProps) => {
  const { format } = useDateUtils()
  const date = format(new Date(), 'do MMMM yyyy')
  const { formatMessage } = useIntl()

  return (
    <Stack space={6}>
      <Stack space={3}>
        <Inline space={3} alignY="center" justifyContent="spaceBetween">
          <Text variant="h2" as="h2">
            {formatMessage(m.results.mainHeading)}
          </Text>
          <Button
            variant="utility"
            size="small"
            icon="print"
            onClick={() => {
              window.print()
            }}
          >
            {formatMessage(m.results.print)}
          </Button>
        </Inline>
        <Text>{date}</Text>
        <Stack space={1}>
          <Text variant="h3" as="h3">
            {formatMessage(m.results.breakdownHeading)}
          </Text>
          <Tabs
            label={formatMessage(m.results.breakdownHeading)}
            selected="table"
            contentBackground="white"
            size="sm"
            tabs={[
              {
                id: 'table',
                label: formatMessage(m.results.tableTabLabel),
                content: (
                  <>
                    <Box className={styles.tabPanelSpacer} />
                    <Table.Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.HeadData>{''}</Table.HeadData>
                          <Table.HeadData text={{ variant: 'eyebrow' }}>
                            {formatMessage(m.results.tableCategory)}
                          </Table.HeadData>
                          <Table.HeadData
                            text={{ variant: 'eyebrow' }}
                            align="right"
                          >
                            {formatMessage(m.results.tableAverage)}
                          </Table.HeadData>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {categoryAverages.map((cat, index) => (
                          <Table.Row key={cat.title}>
                            <Table.Data>{index + 1}</Table.Data>
                            <Table.Data>{cat.title}</Table.Data>
                            <Table.Data align="right">
                              {formatScore(cat.average)}
                            </Table.Data>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Table>
                  </>
                ),
              },
              {
                id: 'chart',
                label: formatMessage(m.results.chartTabLabel),
                content: (
                  <>
                    <Box className={styles.tabPanelSpacer} />
                    <Box width="full" height="full">
                      <ResponsiveContainer
                        width="100%"
                        height={Math.max(
                          380,
                          categoryAverages.length * 42 + 40,
                        )}
                      >
                        <BarChart
                          layout="vertical"
                          data={categoryAverages}
                          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                          barCategoryGap="30%"
                        >
                          <CartesianGrid
                            horizontal={false}
                            stroke={theme.color.blue200}
                          />
                          <XAxis
                            type="number"
                            domain={[0, 3]}
                            ticks={CHART_X_AXIS_TICKS}
                            tickFormatter={formatScore}
                            tickLine={false}
                            axisLine={false}
                            tick={{
                              fontSize: 14,
                              fontWeight: 400,
                              fill: theme.color.dark400,
                            }}
                          />
                          <YAxis
                            type="category"
                            dataKey="title"
                            width={240}
                            tickLine={false}
                            axisLine={false}
                            tick={<CategoryAxisTick />}
                          />
                          <Tooltip
                            formatter={(value: number) => formatScore(value)}
                          />
                          <Bar
                            dataKey="average"
                            fill={theme.color.blue400}
                            barSize={20}
                            radius={[0, 4, 4, 0]}
                            minPointSize={26}
                            label={<BarValueLabel />}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                ),
              },
              {
                id: 'radar',
                label: formatMessage(m.results.radarChartTabLabel),
                content: (
                  <>
                    <Box className={styles.tabPanelSpacer} />
                    <Box width="full" height="full">
                      <ResponsiveContainer width="100%" height={520}>
                        <RadarChart data={categoryAverages} outerRadius="65%">
                          <PolarGrid
                            gridType="polygon"
                            stroke={theme.color.blue200}
                          />
                          <PolarAngleAxis
                            dataKey="title"
                            tick={<RadarCategoryTick />}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 3]}
                            tickCount={CHART_X_AXIS_TICKS.length}
                            tickFormatter={formatScore}
                            tick={{ fontSize: 12, fill: theme.color.blue400 }}
                            axisLine={false}
                            stroke={theme.color.blue200}
                          />
                          <Tooltip
                            formatter={(value: number) => formatScore(value)}
                          />
                          <Radar
                            dataKey="average"
                            stroke={theme.color.blue400}
                            strokeWidth={2}
                            fill={theme.color.blue400}
                            fillOpacity={0.2}
                            dot={{
                              r: 4,
                              fill: theme.color.blue400,
                              stroke: theme.color.blue400,
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                ),
              },
            ]}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="spaceBetween"
            width="full"
            background="purple100"
            borderRadius="large"
            padding={2}
            className={styles.totalAverageBanner}
          >
            <Text variant="medium" fontWeight="regular" color="dark400">
              {formatMessage(m.results.totalAverage)}
            </Text>
            <Text variant="h5" fontWeight="semiBold" color="dark400">
              {formatScore(totalAverage)}
            </Text>
          </Box>
        </Stack>
        <Stack space={1}>
          <Text variant="h3" as="h3">
            {formatMessage(m.results.interpretationHeading)}
          </Text>
          <Text>{getBracketText(totalAverage, formatMessage)}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

interface ECOICalculatorProps {
  slice: ConnectedComponent
}

export const ECOICalculator = ({ slice }: ECOICalculatorProps) => {
  const [stepIndex, setStepIndex] = useQueryState(
    'stepIndex',
    parseAsInteger
      .withOptions({
        history: 'push',
        clearOnDefault: true,
      })
      .withDefault(0),
  )
  const formRef = useRef<HTMLDivElement | null>(null)
  const steps = (slice.json?.steps ?? []) as Step[]
  const initialRender = useRef(true)

  const safeStepIndex = Math.min(Math.max(stepIndex, 0), steps.length)
  const step = steps[safeStepIndex]
  const showResults = safeStepIndex >= steps.length

  const { formatMessage } = useIntl()

  const [state, setState] = useState<CheckboxState>({
    steps: steps.map(({ title, questions }) => ({
      title,
      questions: questions.map(() => ({
        selectedAnswerIndex: -1,
        answerScore: 0,
      })),
    })),
  })

  useEffect(() => {
    if (initialRender.current) {
      setStepIndex(0)
      initialRender.current = false
      return
    }
    window.scrollTo({
      behavior: 'smooth',
      top: formRef.current?.offsetTop ?? 0,
    })
  }, [setStepIndex, stepIndex])

  if (showResults) {
    const categoryAverages = state.steps.map((stateStep) => {
      const questionCount = stateStep.questions.length
      const total = stateStep.questions.reduce(
        (sum, q) => sum + q.answerScore,
        0,
      )
      const average = questionCount > 0 ? total / questionCount : 0
      return { title: stateStep.title, average }
    })

    const totalAverage =
      categoryAverages.length > 0
        ? categoryAverages.reduce((sum, cat) => sum + cat.average, 0) /
          categoryAverages.length
        : 0

    return (
      <Stack space={8}>
        <MarkdownText replaceNewLinesWithBreaks={false}>
          {formatMessage(m.results.topDescription)}
        </MarkdownText>
        <Box className={styles.stayOnSinglePageWhenPrinting}>
          <ECOICalculatorResults
            categoryAverages={categoryAverages}
            totalAverage={totalAverage}
          />
        </Box>
      </Stack>
    )
  }

  const isCurrentStepComplete =
    showResults ||
    state.steps[safeStepIndex]?.questions.every(
      (q) => q.selectedAnswerIndex !== -1,
    )

  return (
    <Stack space={8}>
      <MarkdownText replaceNewLinesWithBreaks={false}>
        {formatMessage(m.form.topDescription)}
      </MarkdownText>
      <Stack space={6}>
        <Box ref={formRef}>
          <Stack space={4}>
            <Stack space={1}>
              <Text>
                {formatMessage(m.form.progress, {
                  stepIndex: safeStepIndex + 1,
                  stepCount: steps.length,
                })}
              </Text>
              <ProgressMeter progress={(safeStepIndex + 1) / steps.length} />
            </Stack>
            <ECOIForm
              step={step}
              stepIndex={safeStepIndex}
              state={state}
              setState={setState}
            />
          </Stack>
        </Box>
        <Inline alignY="center" space={2}>
          {stepIndex > 0 && (
            <Button
              key={`previous-step-${stepIndex}`}
              size="small"
              variant="ghost"
              preTextIcon="arrowBack"
              onClick={() => {
                setStepIndex((s) => s - 1)
              }}
            >
              {formatMessage(m.form.previousStep)}
            </Button>
          )}
          <Button
            key={`next-step-${stepIndex}`}
            disabled={!isCurrentStepComplete}
            size="small"
            onClick={() => {
              if (!isCurrentStepComplete) return
              setStepIndex((s) => s + 1)
            }}
          >
            {formatMessage(
              stepIndex >= steps.length - 1
                ? m.form.seeResults
                : m.form.nextStep,
            )}
          </Button>
        </Inline>
      </Stack>
    </Stack>
  )
}
