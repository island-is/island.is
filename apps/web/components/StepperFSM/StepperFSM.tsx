import React, { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Text,
  Button,
  RadioButton,
  Select,
  GridRow,
  GridColumn,
  GridContainer,
  Link,
} from '@island.is/island-ui/core'

import { Stepper } from '@island.is/api/schema'

import * as styles from './StepperFSM.css'
import { StepperHelper } from './StepperFSMHelper'

import {
  getStepperMachine,
  resolveStepType,
  getStepOptions,
  STEP_TYPES,
  StepOption,
  getStepBySlug,
  StepperMachine,
  getStepQuestion,
  getCurrentStepAndStepType,
} from './StepperFSMUtils'
import { useRouter } from 'next/router'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import { ValueType } from 'react-select'
import { ParsedUrlQuery } from 'querystring'

const ANSWER_DELIMITER = ','

interface StepperProps {
  stepper: Stepper
  startAgainLabel: string
  answerLabel: string
  backLabel: string
}

interface StepOptionSelectItem {
  label: string
  value: string
  transition: string
}

interface QuestionAndAnswer {
  question: string
  answer: string
  slug: string
}

const getInitialStateAndAnswersByQueryParams = (
  stepper: Stepper,
  stepperMachine: StepperMachine,
  query: ParsedUrlQuery,
  activeLocale: string,
) => {
  let initialState = stepperMachine.initialState
  const questionsAndAnswers: QuestionAndAnswer[] = []

  const answerString = (query?.answers ?? '') as string

  // If the query parameter is not a string then we just skip checking further
  if (typeof answerString !== 'string')
    return { initialState, questionsAndAnswers }

  const answers = answerString.split(ANSWER_DELIMITER)

  for (const answer of answers) {
    const stateNode = stepperMachine.states[initialState.value as string]
    const step = getStepBySlug(stepper, stateNode.config.meta.stepSlug)
    const stepType = resolveStepType(step)

    if (stepType === STEP_TYPES.ANSWER) break

    const options = getStepOptions(step, activeLocale)
    const selectedOption = options.find((o) => o.slug === answer)
    if (!selectedOption) break

    initialState = stepperMachine.transition(
      initialState,
      selectedOption.transition,
    )

    const stepQuestion = getStepQuestion(step)
    if (stepQuestion) {
      questionsAndAnswers.push({
        question: stepQuestion,
        answer: selectedOption.label,
        slug: selectedOption.slug,
      })
    }
  }

  return { initialState, questionsAndAnswers }
}

const renderQuestionsAndAnswers = (
  questionsAndAnswers: QuestionAndAnswer[],
  urlWithoutQueryParams: string,
  activeLocale: string,
) => {
  const accumulatedAnswers = []

  return questionsAndAnswers.map(({ question, answer, slug }, i) => {
    const previouslyAccumulatedAnswers = [...accumulatedAnswers]
    accumulatedAnswers.push(slug)
    const query = {
      answers: `${previouslyAccumulatedAnswers.join(ANSWER_DELIMITER)}`,
      previousAnswer: slug,
    }

    return (
      <GridRow key={i} alignItems="center">
        <Box marginRight={2}>
          <Text variant="h4">{question}</Text>
        </Box>
        <Box marginRight={2}>
          <Text>{answer}</Text>
        </Box>
        <Box>
          <Link
            href={{
              pathname: urlWithoutQueryParams,
              query: query,
            }}
            color="blue400"
            underline="small"
          >
            {activeLocale === 'is' ? 'Breyta' : 'Change'}
          </Link>
        </Box>
      </GridRow>
    )
  })
}

export const StepperFSM = ({ stepper }: StepperProps) => {
  const router = useRouter()
  const { activeLocale } = useI18n()

  const stepperMachine = useMemo(() => getStepperMachine(stepper), [stepper])

  const { initialState, questionsAndAnswers } = useMemo(() => {
    return getInitialStateAndAnswersByQueryParams(
      stepper,
      stepperMachine,
      router.query,
      activeLocale,
    )
  }, [activeLocale, router.query, stepper, stepperMachine])

  const [currentState, setCurrentState] = useState(initialState)

  useEffect(() => {
    setCurrentState(initialState)
  }, [initialState])

  // Since this gets it's value from useMemo then it can be undefined on the first pass, so be vary of that
  const { currentStep, currentStepType } = useMemo(
    () => getCurrentStepAndStepType(stepper, currentState),
    [stepper, currentState],
  )

  // TODO: Read showStepperConfigHelper from environment feature flag.
  // TODO: Add triple-click to show helper.
  const showStepperConfigHelper = true

  // TODO: Add support for rendering OptionsFromSource from Step definition.
  // TODO: Currently, if you call the send function with an unavailable transition string, then it silently fails.

  const isOnFirstStep = stepperMachine.initialState.value === currentState.value
  const [selectedOption, setSelectedOption] = useState<StepOption | null>(null)
  const stepOptions = useMemo<StepOption[]>(
    () =>
      currentStepType !== STEP_TYPES.ANSWER
        ? getStepOptions(currentStep, activeLocale)
        : [],
    [activeLocale, currentStep, currentStepType],
  )

  const [
    hasClickedContinueWithoutSelecting,
    setHasClickedContinueWithoutSelecting,
  ] = useState<boolean>(false)

  useEffect(() => {
    let previousAnswerIsValid = false

    // Select the option that was previously selected if we want to change an answer
    if (router.query.previousAnswer && selectedOption === null) {
      const option =
        stepOptions.find((o) => o.slug === router.query.previousAnswer) ?? null
      setSelectedOption(option)
      previousAnswerIsValid = option !== null
    }

    // Select the first item by default if we have a dropdown
    if (
      currentStepType === STEP_TYPES.QUESTION_DROPDOWN &&
      selectedOption === null &&
      stepOptions.length > 0 &&
      !previousAnswerIsValid
    ) {
      setSelectedOption(stepOptions[0])
    }
  }, [router.query, currentStepType, selectedOption, stepOptions])

  const ContinueButton = () => (
    <Box marginTop={3}>
      <Button
        onClick={() => {
          if (selectedOption === null) {
            setHasClickedContinueWithoutSelecting(true)
            return
          }
          setHasClickedContinueWithoutSelecting(false)

          setCurrentState((prevState) => {
            const newState = stepperMachine.transition(
              currentState,
              selectedOption.transition,
            )

            const transitionWorked = newState.value !== prevState.value
            const onTheInitialStep =
              prevState.value === stepperMachine.initialState.value

            const pathnameWithoutQueryParams = router.asPath.split('?')[0]
            const previousAnswers =
              router.query?.answers &&
              typeof router.query?.answers === 'string' &&
              !onTheInitialStep
                ? router.query.answers.concat(ANSWER_DELIMITER)
                : ''

            router.push(
              {
                pathname: pathnameWithoutQueryParams,
                query: {
                  answers: `${previousAnswers}${selectedOption.slug}`,
                },
              },
              undefined,
              { shallow: true },
            )

            if (!transitionWorked) {
              // TODO: show that it didn't work
            }

            if (transitionWorked) setSelectedOption(null)

            return newState
          })
        }}
      >
        {activeLocale === 'is' ? 'Áfram' : 'Continue'}
      </Button>
    </Box>
  )

  return (
    <Box className={styles.container}>
      {currentStep && richText(currentStep.subtitle as SliceType[])}

      {currentStepType === STEP_TYPES.QUESTION_RADIO && (
        <>
          {stepOptions.map(function (option, i) {
            const key = `step-option-${i}`
            return (
              <RadioButton
                key={key}
                name={key}
                large={true}
                hasError={
                  hasClickedContinueWithoutSelecting && selectedOption === null
                }
                label={option.label}
                checked={option.slug === selectedOption?.slug}
                onChange={() => setSelectedOption(option)}
              />
            )
          })}
          <ContinueButton />
        </>
      )}

      {currentStepType === STEP_TYPES.QUESTION_DROPDOWN && (
        <>
          <Select
            name="step-option-select"
            noOptionsMessage={
              activeLocale === 'is' ? 'Enginn valmöguleiki' : 'No options'
            }
            value={{
              label: selectedOption?.label,
              value: selectedOption?.slug,
            }}
            onChange={(option: ValueType<StepOptionSelectItem>) => {
              const stepOptionSelectItem = option as StepOptionSelectItem
              const newSelectedOption = {
                label: stepOptionSelectItem.label,
                slug: stepOptionSelectItem.value,
                transition: stepOptionSelectItem.transition,
              }
              setSelectedOption(newSelectedOption)
            }}
            options={stepOptions.map((option) => ({
              label: option.label,
              value: option.slug,
              transition: option.transition,
            }))}
          />
          <ContinueButton />
        </>
      )}

      {/* {currentStepType === STEP_TYPES.ANSWER && <Text>Render Answer...</Text>} */}

      {!isOnFirstStep && (
        <Box marginTop={3}>
          <Text variant="h3" marginBottom={2}>
            {activeLocale === 'is' ? 'Svörin þín' : 'Your answers'}
          </Text>
          <Box marginBottom={3}>
            <Button
              variant="text"
              onClick={() => {
                router.push(router.asPath.split('?')[0], undefined, {
                  shallow: true,
                })
              }}
            >
              {activeLocale === 'is' ? 'Byrja aftur' : 'Start again'}
            </Button>
          </Box>
          <GridContainer>
            <GridColumn>
              {renderQuestionsAndAnswers(
                questionsAndAnswers,
                router.asPath.split('?')[0],
                activeLocale,
              )}
            </GridColumn>
          </GridContainer>
        </Box>
      )}

      {showStepperConfigHelper && (
        <StepperHelper
          stepper={stepper}
          currentState={currentState}
          currentStep={currentStep}
        />
      )}
    </Box>
  )
}
