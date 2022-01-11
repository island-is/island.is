import React, { useMemo, useState } from 'react'
import { useMachine } from '@xstate/react'

import {
  Box,
  Text,
  Button,
  RadioButton,
  Select,
} from '@island.is/island-ui/core'

import { Step, Stepper } from '@island.is/api/schema'

import * as style from './StepperFSM.css'
import { StepperHelper } from './StepperFSMHelper'

import {
  getStepperMachine,
  getCurrentStep,
  resolveStepType,
  getStepOptions,
  STEP_TYPES,
  StepOption,
} from './StepperFSMUtils'
import { useRouter } from 'next/router'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import { ValueType } from 'react-select'

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
  const stepperMachine = getStepperMachine(stepper)
  const [currentState, send] = useMachine(stepperMachine)

  // TODO: Consider keeping track of current step.
  // TODO: Consider explicitly stating the type of current step.
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

  const router = useRouter()
  const { activeLocale } = useI18n()

  const isOnFirstStep = stepperMachine.initialState.value === currentState.value
  const [selectedOption, setSelectedOption] = useState<StepOption | undefined>(
    undefined,
  )
  const stepOptions = getStepOptions(currentStep, activeLocale)

  // Select the first item by default if we have a dropdown
  if (
    currentStepType === STEP_TYPES.QUESTION_DROPDOWN &&
    selectedOption === undefined &&
    stepOptions.length > 0
  ) {
    setSelectedOption(stepOptions[0])
  }

  return (
    <Box className={style.container}>
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
                label={option.label}
                checked={option.slug === selectedOption?.slug}
                onChange={() => setSelectedOption(option)}
              />
            )
          })}
          <Box marginTop={3}>
            {/* TODO: Validate whether there is a selectedOption, if not then show what needs to happen */}
            <Button onClick={() => send('selectedOption.transition')}>
              {activeLocale === 'is' ? 'Áfram' : 'Continue'}
            </Button>
          </Box>
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
            options={stepOptions.map((option) => {
              return {
                label: option.label,
                value: option.slug,
                transition: option.transition,
              }
            })}
          />
          <Box marginTop={3}>
            <Button onClick={() => send(selectedOption.transition)}>
              {activeLocale === 'is' ? 'Áfram' : 'Continue'}
            </Button>
          </Box>
        </>
      )}
      {currentStepType === STEP_TYPES.ANSWER && <Text>Render Answer...</Text>}

      {!isOnFirstStep && (
        <Box marginTop={3}>
          {/*TODO: change this to transition the machine to the initial state insted of reloading the page */}
          <Button variant="text" onClick={router.reload}>
            {activeLocale === 'is' ? 'Byrja aftur' : 'Start again'}
          </Button>
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
