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

  const router = useRouter()
  const isOnFirstStep = stepperMachine.initialState.value === currentState.value

  return (
    <Box className={style.container}>
      {currentStep.subtitle}
      {currentState.nextEvents.map(function (nextEvent, i) {
        return (
          <Button
            key={i}
            onClick={() => {
              send(nextEvent)
            }}
          >
            {nextEvent}
          </Button>
        )
      })}

      {!isOnFirstStep && (
        <Box marginTop={3}>
          <Button variant="text" onClick={router.reload}>
            {/*TODO: change this to transition the machine to the initial state insted of reloading the page */}
            Start again
          </Button>
        </Box>
      )}

      {currentStepType === STEP_TYPES.QUESTION_RADIO && (
        <Text>Render Question Radio options...</Text>
      )}
      {currentStepType === STEP_TYPES.QUESTION_DROPDOWN && (
        <Text>Render Question Dropdownb options...</Text>
      )}
      {currentStepType === STEP_TYPES.ANSWER && <Text>Render Answer...</Text>}

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
