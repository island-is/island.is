import React, { useMemo } from 'react'
import { useMachine } from '@xstate/react'

import { Box, Text, Button } from '@island.is/island-ui/core'

import { Step, Stepper } from '@island.is/api/schema'

import * as style from './StepperFSM.css'
import { StepperHelper } from './StepperFSMHelper'

import {
  getStepperMachine,
  getCurrentStep,
  resolveStepType,
  getStepOptions,
  STEP_TYPES,
} from './StepperFSMUtils'
import { useRouter } from 'next/router'

interface StepperProps {
  stepper: Stepper
  startAgainLabel: string
  answerLabel: string
  backLabel: string
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
  const isOnFirstStep = stepperMachine.initialState.value === currentState.value

  return (
    <Box className={style.container}>
      {/* TODO: Render step subtitle {richText(currentStep.subtitle)} */}

      {currentStepType === STEP_TYPES.QUESTION_RADIO && (
        <>
          <Text>Render Question Radio options...</Text>
          { getStepOptions(currentStep).map(function (option, i) {
            return (
              <Button
                key={i}
                onClick={() => {
                  console.log("selected option: ", option)
                  send(option.transition)
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </>
      )}
      {currentStepType === STEP_TYPES.QUESTION_DROPDOWN && (
        <>
          <Text>Render Question Dropdown options...</Text>
          { getStepOptions(currentStep).map(function (option, i) {
            return (
              <Button
                key={i}
                onClick={() => {
                  console.log("selected option: ", option)
                  send(option.transition)
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </>
      )}
      {currentStepType === STEP_TYPES.ANSWER && <Text>Render Answer...</Text>}

      {!isOnFirstStep && (
        <Box marginTop={3}>
          <Button variant="text" onClick={router.reload}>
            {/*TODO: change this to transition the machine to the initial state insted of reloading the page */}
            Start again
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
