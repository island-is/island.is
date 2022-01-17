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

const getInitialStateAndAnswersByQueryParams = (
  stepper: Stepper,
  stepperMachine: StepperMachine,
  query: ParsedUrlQuery,
  activeLocale: string,
) => {
  let initialState = stepperMachine.initialState
  const questionsAndAnswers: { question: string; answer: string }[] = []

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
      })
    }
  }

  return { initialState, questionsAndAnswers }
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

  // TODO: Render Step options instead of raw transitions from machine.
  // TODO: Add support for rendering OptionsFromSource from Step definition.
  // TODO: Add compoment for showing previous answers.
  // TODO: Append answer to query parameter when submitting.
  // TODO: Add support for initializing the State Machine using provided answers query parameter.
  // TODO: Currently, if you call the send function with an unavailable transition string, then it silently fails.

  const isOnFirstStep = stepperMachine.initialState.value === currentState.value
  const [selectedOption, setSelectedOption] = useState<StepOption | undefined>(
    undefined,
  )
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

  // Select the first item by default if we have a dropdown
  if (
    currentStepType === STEP_TYPES.QUESTION_DROPDOWN &&
    selectedOption === undefined &&
    stepOptions.length > 0
  ) {
    setSelectedOption(stepOptions[0])
  }

  const ContinueButton = () => (
    <Box marginTop={3}>
      <Button
        onClick={() => {
          if (selectedOption === undefined) {
            setHasClickedContinueWithoutSelecting(true)
            return
          }
          setHasClickedContinueWithoutSelecting(false)
          setSelectedOption(undefined)

          setCurrentState(
            stepperMachine.transition(currentState, selectedOption.transition),
          )

          const pathnameWithoutQueryParams = router.asPath.split('?')[0]

          const answers = `${
            router.query?.answers && typeof router.query?.answers === 'string'
              ? router.query.answers.concat(ANSWER_DELIMITER)
              : ''
          }${selectedOption.slug}`

          router.push(
            {
              pathname: pathnameWithoutQueryParams,
              query: {
                answers: answers,
              },
            },
            undefined,
            { shallow: true },
          )
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
                  hasClickedContinueWithoutSelecting &&
                  selectedOption === undefined
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
          <Box disabled={true} marginBottom={3}>
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
              {questionsAndAnswers.map(({ question, answer }, i) => (
                <GridRow key={i} alignItems="center">
                  <Box marginRight={2}>
                    <Text variant="h4">{question}</Text>
                  </Box>
                  <Box>
                    <Text>{answer}</Text>
                  </Box>
                </GridRow>
              ))}
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
