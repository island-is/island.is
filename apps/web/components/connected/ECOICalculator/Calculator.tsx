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
  Box,
  Button,
  Inline,
  ProgressMeter,
  RadioButton,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
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
                      name={id}
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

interface ECOICalculatorResultsProps {
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

const ECOICalculatorResults = ({
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
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.HeadData>{''}</Table.HeadData>
                <Table.HeadData>
                  {formatMessage(m.results.tableCategory)}
                </Table.HeadData>
                <Table.HeadData align="right">
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
            <Table.Foot>
              <Table.Row>
                <Table.Data box={{ background: 'blue100' }}>{''}</Table.Data>
                <Table.Data
                  box={{ background: 'blue100' }}
                  text={{ fontWeight: 'semiBold' }}
                >
                  {formatMessage(m.results.totalAverage)}
                </Table.Data>
                <Table.Data
                  box={{ background: 'blue100' }}
                  text={{ fontWeight: 'semiBold' }}
                  align="right"
                >
                  {formatScore(totalAverage)}
                </Table.Data>
              </Table.Row>
            </Table.Foot>
          </Table.Table>
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

  const step = steps[stepIndex]
  const showResults = stepIndex >= steps.length

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
                  stepIndex: stepIndex + 1,
                  stepCount: steps.length,
                })}
              </Text>
              <ProgressMeter progress={(stepIndex + 1) / steps.length} />
            </Stack>
            <ECOIForm
              step={step}
              stepIndex={stepIndex}
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
            size="small"
            onClick={() => {
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
