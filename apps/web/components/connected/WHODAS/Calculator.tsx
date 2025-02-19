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
  Bullet,
  BulletList,
  Button,
  Inline,
  ProgressMeter,
  RadioButton,
  Stack,
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
    maxScorePossible: number
    questions: {
      selectedAnswerIndex: number
      answerScore: number
    }[]
  }[]
}

interface WHODASFormProps {
  step: Step
  stepIndex: number
  state: CheckboxState
  setState: Dispatch<SetStateAction<CheckboxState>>
}

const WHODASForm = ({ step, stepIndex, state, setState }: WHODASFormProps) => {
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

                  if (answerIndex > 4) {
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

interface WHODASResultsProps {
  results: {
    steps: (Pick<Step, 'title'> & { scoreForStep: number })[]
  }
  bracket: 1 | 2
  totalScore: number
}

const WHODASResults = ({
  results,
  bracket,
  totalScore,
}: WHODASResultsProps) => {
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
            {formatMessage(m.results.scoreHeading)}
          </Text>
          <Box background="purple100" padding="p2" borderRadius="large">
            <Text>
              {formatScore(totalScore)} {formatMessage(m.results.outOf100)}
            </Text>
          </Box>
        </Stack>
        <Stack space={1}>
          <Text variant="h3" as="h3">
            {formatMessage(m.results.interpretationHeading)}
          </Text>
          <Text>
            {formatMessage(
              bracket === 1
                ? m.results.firstBracketInterpretationText
                : m.results.secondBracketInterpretationText,
            )}
          </Text>
        </Stack>

        <Stack space={1}>
          <Text variant="h3" as="h3">
            {formatMessage(m.results.adviceHeading)}
          </Text>
          <MarkdownText replaceNewLinesWithBreaks={false}>
            {formatMessage(
              bracket === 1
                ? m.results.firstBracketAdviceText
                : m.results.secondBracketAdviceText,
            )}
          </MarkdownText>
        </Stack>

        {bracket > 1 && (
          <Stack space={6}>
            <Stack space={3}>
              <Stack space={3}>
                <Text variant="h3" as="h3">
                  {formatMessage(m.results.breakdownHeading)}
                </Text>
                <BulletList>
                  {results.steps.map((step) => (
                    <Bullet key={step.title}>
                      <Box className={styles.breakdownRowContainer}>
                        <Text>{step.title}</Text>
                        <Text>
                          {formatScore(step.scoreForStep)}{' '}
                          {formatMessage(m.results.outOf100)}
                        </Text>
                      </Box>
                    </Bullet>
                  ))}
                </BulletList>
              </Stack>
            </Stack>
            <Box
              background="blue100"
              paddingX={[4]}
              paddingY={[3]}
              borderRadius="large"
            >
              <Text>{formatMessage(m.results.resultDisclaimer)}</Text>
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

interface WHODASCalculatorProps {
  slice: ConnectedComponent
}

export const WHODASCalculator = ({ slice }: WHODASCalculatorProps) => {
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
    steps: steps.map(({ title, description, questions }) => ({
      title,
      description,
      maxScorePossible: questions.reduce(
        (prev, acc) =>
          prev +
          (acc.answerOptions.length > 0
            ? acc.answerOptions[acc.answerOptions.length - 1].score
            : 0),
        0,
      ),
      questions: questions.map(() => ({
        selectedAnswerIndex: 0,
        answerScore: 0,
      })),
    })),
  })

  useEffect(() => {
    if (initialRender.current) {
      setStepIndex(0) // Reset step index on initial render
      initialRender.current = false
      return
    }
    window.scrollTo({
      behavior: 'smooth',
      top: formRef.current?.offsetTop ?? 0,
    })
  }, [setStepIndex, stepIndex])

  if (showResults) {
    let totalScore = 0
    let totalMaxScorePossible = 0
    const results: WHODASResultsProps['results'] = {
      steps: [],
    }
    for (const stateStep of state.steps) {
      totalMaxScorePossible += stateStep.maxScorePossible
      let score = 0
      for (const question of stateStep.questions) {
        score += question.answerScore
      }
      totalScore += score
      if (stateStep.maxScorePossible > 0) {
        score = (score * 100) / stateStep.maxScorePossible
      }
      results.steps.push({ ...stateStep, scoreForStep: score })
    }
    if (totalMaxScorePossible > 0) {
      totalScore = (totalScore * 100) / totalMaxScorePossible
    }
    return (
      <Stack space={8}>
        <MarkdownText replaceNewLinesWithBreaks={false}>
          {formatMessage(m.results.topDescription)}
        </MarkdownText>
        <Box className={styles.stayOnSinglePageWhenPrinting}>
          <WHODASResults
            results={results}
            bracket={
              totalScore <= (slice.configJson?.firstBracketBreakpoint ?? 16.9)
                ? 1
                : 2
            }
            totalScore={totalScore}
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
            <WHODASForm
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
