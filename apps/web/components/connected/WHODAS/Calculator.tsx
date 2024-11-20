import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Bullet,
  BulletList,
  Button,
  Inline,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { MarkdownText } from '../../Organization'
import { m } from './Calculator.strings'
import * as styles from './Calculator.css'

interface Question {
  question: string
  answerOptions: {
    score: number
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

                  if (answerIndex > 3) {
                    return null
                  }

                  const label = formatMessage(
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
}

const WHODASResults = ({ results, bracket }: WHODASResultsProps) => {
  const { format } = useDateUtils()
  const date = format(new Date(), 'do MMMM yyyy')

  const { formatMessage } = useIntl()

  return (
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
            {formatMessage(
              bracket === 1
                ? m.results.firstBracketScoreText
                : m.results.secondBracketScoreText,
            )}
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

      {bracket !== 1 && (
        <Stack space={1}>
          <Text variant="h3" as="h3">
            {formatMessage(m.results.breakdownHeading)}
          </Text>
          <BulletList>
            {results.steps.map((step) => (
              <Bullet key={step.title}>
                <Box className={styles.breakdownRowContainer}>
                  <Text>{step.title}</Text>
                  <Text>{step.scoreForStep}</Text>
                </Box>
              </Bullet>
            ))}
          </BulletList>
        </Stack>
      )}
    </Stack>
  )
}

interface WHODASCalculatorProps {
  slice: ConnectedComponent
}

export const WHODASCalculator = ({ slice }: WHODASCalculatorProps) => {
  const [stepIndex, setStepIndex] = useState(0)
  const formRef = useRef<HTMLDivElement | null>(null)
  const steps = (slice.json?.steps ?? []) as Step[]

  const step = steps[stepIndex]
  const showResults = stepIndex >= steps.length

  const { formatMessage } = useIntl()

  const [state, setState] = useState<CheckboxState>({
    steps: steps.map(({ title, description, questions }) => ({
      title,
      description,
      questions: questions.map(() => ({
        selectedAnswerIndex: 0,
        answerScore: 0,
      })),
    })),
  })

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: formRef.current?.offsetTop ?? 0,
    })
  }, [stepIndex])

  if (showResults) {
    let totalScore = 0
    const results: WHODASResultsProps['results'] = {
      steps: [],
    }
    for (const stateStep of state.steps) {
      let score = 0
      for (const question of stateStep.questions) {
        score += question.answerScore
      }
      results.steps.push({ ...stateStep, scoreForStep: score })
      totalScore += score
    }
    return (
      <WHODASResults
        results={results}
        bracket={
          totalScore <= (slice.configJson?.firstBracketBreakpoint ?? 16.9)
            ? 1
            : 2
        }
      />
    )
  }

  return (
    <Stack space={6}>
      <Box ref={formRef}>
        <WHODASForm
          step={step}
          stepIndex={stepIndex}
          state={state}
          setState={setState}
        />
      </Box>
      <Inline alignY="center" space={2}>
        {stepIndex > 0 && (
          <Button
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
          size="small"
          onClick={() => {
            setStepIndex((s) => s + 1)
          }}
        >
          {formatMessage(m.form.nextStep)}
        </Button>
      </Inline>
    </Stack>
  )
}
