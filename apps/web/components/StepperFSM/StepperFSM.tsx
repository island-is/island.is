import React, { useMemo, useState } from 'react'
import { useMachine } from '@xstate/react'

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

import { Step, Stepper } from '@island.is/api/schema'

import * as styles from './StepperFSM.css'
import { StepperHelper } from './StepperFSMHelper'

import {
  getStepperMachine,
  getCurrentStep,
  resolveStepType,
  getStepOptions,
  STEP_TYPES,
  StepOption,
  getStepBySlug,
  getStateMeta,
  StepperMachine,
} from './StepperFSMUtils'
import { useRouter } from 'next/router'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import { ValueType } from 'react-select'
import { State } from 'xstate'

const answerDelimiter = ','

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

export const StepperFSM = ({ stepper }: StepperProps) => {
  const router = useRouter()
  const { activeLocale } = useI18n()
  const stepperMachine = getStepperMachine(stepper)

  const getInitialState = () => {
    let initialState = stepperMachine.initialState

    const answerString = (router.query?.answers ?? '') as string

    // If the query parameter is not a string then we just skip checking further
    if (!(typeof answerString === 'string' || answerString instanceof String))
      return initialState

    const answers = answerString.split(answerDelimiter)

    // TODO: loop through all the answers and transition onwards

    const state = stepperMachine.states[stepperMachine.config.initial as string]

    const step = getStepBySlug(stepper, state.config.meta.stepSlug)

    if (step.stepType === 'Answer') return initialState

    const options = getStepOptions(step, activeLocale)

    const selectedOption = options.find((o) => o.slug === answers[0])

    // console.log(selectedOption)
    if (!selectedOption) return initialState

    initialState = stepperMachine.transition(
      initialState,
      selectedOption.transition,
    )

    return initialState
  }

  const [currentState, send] = useMachine(stepperMachine, {
    state: getInitialState(),
  })

  const currentStep = useMemo<Step>(() => {
    return getCurrentStep(stepper, currentState)
  }, [stepper, currentState])

  const currentStepType = useMemo<string>(() => {
    return resolveStepType(currentStep)
  }, [currentStep])

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
  const stepOptions = useMemo(
    () =>
      currentStepType !== STEP_TYPES.ANSWER
        ? getStepOptions(currentStep, activeLocale)
        : [],
    [activeLocale, currentStep, currentStepType],
  )

  const stepperQnA = [
    { question: 'Frá hvaða landi kemur þú?', answer: 'Ísland' },
    { question: 'Ertu viss um að hafa valið rétt land?', answer: 'Nei' },
  ]

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
          send(selectedOption.transition)

          const pathnameWithoutQueryParams = router.asPath.split('?')[0]

          const answers = `${
            router.query?.answers
              ? router.query.answers.concat(answerDelimiter)
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
      {richText(currentStep.subtitle as SliceType[])}

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
          {/* TODO: change this to transition the machine to the initial state insted of reloading the page */}
          <Box disabled={true} marginBottom={3}>
            <Button variant="text" onClick={router.reload}>
              {activeLocale === 'is' ? 'Byrja aftur' : 'Start again'}
            </Button>
          </Box>
          <GridContainer>
            <GridColumn>
              {stepperQnA.map(({ question, answer }, i) => (
                <GridRow key={i} alignItems="center">
                  <Box marginRight={2}>
                    <Text variant="h4">{question}</Text>
                  </Box>
                  <Box width="half">
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
