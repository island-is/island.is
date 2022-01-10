import React, { useMemo } from 'react'
import { useMachine } from '@xstate/react'

import { Box, Text, Button } from '@island.is/island-ui/core'

import { Step, Stepper } from '@island.is/api/schema'

import * as style from './StepperFSM.css'
import { StepperHelper } from './StepperFSMHelper'
import { getStepperMachine, getCurrentStep } from './StepperFSMUtils'

interface StepperProps {
  stepper: Stepper
  startAgainLabel: string
  answerLabel: string
  backLabel: string
}

export const StepperFSM = ({ stepper }: StepperProps) => {
  const [currentState, send] = useMachine(getStepperMachine(stepper))

  // TODO: Consider keeping track of current step.
  // TODO: Consider explicitly stating the type of current step.
  const currentStep = useMemo<Step>(() => {
    return getCurrentStep(stepper, currentState)
  }, [stepper, currentState])

  // TODO: Read showStepperConfigHelper from environment feature flag.
  // TODO: Add triple-click to show helper.
  const showStepperConfigHelper = true

  // TODO: Render Step options instead of raw transitions from machine.
  // TODO: Add support for rendering OptionsFromSource from Step definition.
  // TODO: Add compoment for showing previous answers.
  // TODO: Add option to start over.
  // TODO: Append answer to query parameter when submitting.
  // TODO: Add support for initializing the State Machine using provided answers query parameter.

  return (
    <Box className={style.container}>
      <Text variant="h3">{currentStep.title}</Text>
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
